import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import validate from './validate.js';
import render from './render.js';
import resources from './locales/index';
import parse from './parse.js';

const addProxy = (url) => {
  const urlWithProxy = new URL('/get', 'https://hexlet-allorigins.herokuapp.com');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};
const postLoader = (states, feds) => {
  const watcherState = states;
  const { baseUrl } = feds;
  const urlWithProxy = addProxy(baseUrl);

  axios.get(urlWithProxy)
    .then((resp) => {
      const { posts } = parse(resp.data.contents, baseUrl);
      const newPost = [];
      posts.forEach((e) => {
        if (!states.posts.find((oldPost) => oldPost.linkToOrigin === e.linkToOrigin)) {
          newPost.push(e);
        }
      });
      if (newPost.length === 0) {
        return;
      }
      watcherState.posts = [...newPost, ...watcherState.posts];
    });
  setTimeout(() => postLoader(states, feds), 5000);
};

export default () => i18next.init({
  lng: 'ru',
  debug: false,
  resources,
}).then(() => {
  const states = {
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

  const watcherState = onChange(states, (path, value) => {
    const view = render(watcherState, path, value, formElements);
    return view;
  });

  formElements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    formElements.submitBtn.disabled = true;
    formElements.input.readOnly = true;
    const formData = new FormData(formElements.form);
    console.log(formData);

    validate(formData.get('url')).then((resp) => {
      states.form.currentUrl = resp;
      if (states.form.urls.includes(resp)) {
        watcherState.message = 'alreadyExists';
        throw new Error('alreadyExists');
      }
      watcherState.form.urls.push(resp);
    }).then(() => {
      // axios.get(proxy, {params: {url: states.form.currentUrl, ...config}});
      const urlWithProxy = addProxy(states.form.currentUrl);
      return axios.get(urlWithProxy);
    })
      .then((axiosResp) => parse(axiosResp.data.contents, states.form.currentUrl))
      .then((resp) => {
        const { feed, posts } = resp;
        watcherState.feeds = [feed, ...watcherState.feeds];
        watcherState.posts = [...posts, ...watcherState.posts];
        return feed;
      })
      .then((feeds) => {
        watcherState.message = 'success';
        return feeds;
      })
      .then((feed) => {
        setTimeout(() => postLoader(watcherState, feed), 5000);
      })
      .catch((err) => {
        console.log(err);
        if (err.isAxiosError) {
          watcherState.message = 'networkError';
          // throw Error('networkError');
        } else {
          watcherState.message = err.message;
        }
      });
  });
});
