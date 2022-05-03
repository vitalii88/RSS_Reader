import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import validate from './validate.js';
import render from './render.js';
import resources from './locales/index.js';
import parse from './parse.js';

const addProxy = (url) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};
const postLoader = (state, feds) => {
  const watcherState = state;
  const { baseUrl } = feds;
  const urlWithProxy = addProxy(baseUrl);

  axios.get(urlWithProxy)
    .then((resp) => {
      const { posts } = parse(resp.data.contents, baseUrl);
      const newPost = [];
      posts.forEach((e) => {
        if (!state.posts.find((oldPost) => oldPost.linkToOrigin === e.linkToOrigin)) {
          newPost.push(e);
        }
      });
      if (newPost.length === 0) {
        return;
      }
      watcherState.posts = [...newPost, ...watcherState.posts];
    });
  setTimeout(() => postLoader(state, feds), 5000);
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
    feeds: {
      names: [],
      status: '',
    },
    posts: [],
    modal: {
      title: '',
      post: '',
      link: '',
      id: '',
    },
    readPost: [],
    error: '',
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
    // formElements.submitBtn.disabled = true;
    // formElements.input.readOnly = true;
    watcherState.form.status = 'dispatch';
    const formData = new FormData(formElements.form);

    validate(formData.get('url'))
      .then((resp) => {
        state.form.currentUrl = resp;
        if (state.form.urls.includes(resp)) {
          // watcherState.error = 'alreadyExists';
          throw new Error('alreadyExists');
        }
        watcherState.form.urls.push(resp);
        const urlWithProxy = addProxy(state.form.currentUrl);
        return axios.get(urlWithProxy);
      }).then((axiosResp) => {
        const { feed, posts } = parse(axiosResp.data.contents, state.form.currentUrl);
        watcherState.feeds.names = [feed, ...watcherState.feeds.names];
        watcherState.posts = [...posts, ...watcherState.posts];
        watcherState.form.status = 'success';
        setTimeout(() => postLoader(watcherState, feed), 5000);
      })
      .catch((err) => {
        if (err.isAxiosError) {
          watcherState.error = 'networkError';
        } else {
          watcherState.error = err.message;
        }
      });
  });
});
