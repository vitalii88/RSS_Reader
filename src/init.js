import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import validate from './validate.js';
import render from './render.js';
import resources from './locales/index';
import parse from './parse.js';

const addUrlProxy = (url) => {
  const urlWithProxy = new URL('/get', 'https://hexlet-allorigins.herokuapp.com');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};

const postBuilder = (post) => {
  const postTitle = post.querySelector('title').textContent;
  const postDescription = post.querySelector('description').textContent;
  const linkToOrigin = post.querySelector('link').textContent;
  const id = _.uniqueId();
  return {
    id, postTitle, postDescription, linkToOrigin,
  };
};

const renderPost = (baseUrl, xmlData) => {
  const title = xmlData.querySelector('title').textContent;
  const description = xmlData.querySelector('description').textContent;
  const posts = Array.from(xmlData.querySelectorAll('item')).map(postBuilder);
  const result = { feed: { title, description, baseUrl }, posts };
  return result;
};

const loadPosts = (state, feed) => {
  const { baseUrl } = feed;
  const urlWithProxy = addUrlProxy(baseUrl);

  axios.get(urlWithProxy)
    .then((resp) => {
      const xmlData = parse(resp.data.contents);
      const { posts } = renderPost(baseUrl, xmlData);
      const newPost = [];
      posts.forEach((e) => {
        if (!state.posts.find((oldPost) => oldPost.linkToOrigin === e.linkToOrigin)) {
          newPost.push(e);
        }
      });
      if (newPost.length === 0) {
        return;
      }
      state.posts = [...newPost, ...state.posts];
    });
};

export default () => i18next.init({
  lng: 'ru',
  debug: false,
  resources,
}).then(() => {
  const state = {
    form: {
      currentUrl: '',
      urls: [],
      status: '',
    },
    message: '',
    feeds: [],
    posts: [],
    modal: {
      title: '',
      post: '',
      link: '',
      id: '',
    },
    readPost: [],
  };

  const formElements = {
    form: document.querySelector('form'),
    input: document.getElementById('url-input'),
    msgBlock: document.querySelector('.feedback'),
    submitBtn: document.querySelector('button[type="submit"]'),
  };

  const watcherState = onChange(state, (path, value) => {
    render(watcherState, path, value, formElements);
  });

  formElements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watcherState.form.status = 'dispatch';
    const formData = new FormData(formElements.form);

    validate(formData.get('url')).then((resp) => {
      state.form.currentUrl = resp;
      if (state.form.urls.includes(resp)) {
        throw new Error('alreadyExists');
      }
      watcherState.form.urls.push(resp);
    }).then(() => {
      const urlWithProxy = addUrlProxy(state.form.currentUrl);
      return axios.get(urlWithProxy);
    })
      .then((axiosResp) => {
        const xmlData = parse(axiosResp.data.contents);
        const renderedPosts = renderPost(state.form.currentUrl, xmlData);
        return renderedPosts;
      })
      .then((resp) => {
        const { feed, posts } = resp;
        watcherState.feeds = [feed, ...watcherState.feeds];
        watcherState.posts = [...posts, ...watcherState.posts];
        return feed;
      })
      .then((feeds) => {
        watcherState.form.status = 'success';
        return feeds;
      })
      .then((feed) => {
        setInterval(() => loadPosts(watcherState, feed), 5000, formElements);
      })
      .catch((err) => {
        if (err.isAxiosError) {
          watcherState.form.status = 'networkError';
        } else {
          watcherState.form.status = err.message;
        }
      });
  });
});
