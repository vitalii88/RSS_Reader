import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import validator from './validator.js';
import render from './render.js';
import resources from './i18n/index';
import parser from './parser.js';

// const proxy = 'https://hexlet-allorigins.herokuapp.com/get';
// const config = {
//   disableCache: true,
// };
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
      const { posts } = parser(resp.data.contents, baseUrl);
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

export default () => i18next.init({
  lng: 'ru',
  debug: false,
  resources,
}).then(() => {
  const watcherState = onChange(state, (path, value) => {
    render(watcherState, path, value, formElements);
  });

  formElements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(formElements.form);

    validator(formData.get('url')).then((resp) => {
      if (state.form.urls.includes(resp)) {
        watcherState.message = 'alreadyExists';
        throw new Error('alreadyExists');
      }
      state.form.currentUrl = resp;
      formElements.submitBtn.disabled = true;
      formElements.input.readOnly = true;
      watcherState.form.urls.push(resp);
    }).then(() => {
      const urlWithProxy = addProxy(state.form.currentUrl);
      return axios.get(urlWithProxy);
    })
      .then((axiosResp) => parser(axiosResp.data.contents, state.form.currentUrl))
      .then((resp) => {
        const { feed, posts } = resp;
        watcherState.feeds = [feed, ...watcherState.feeds];
        watcherState.posts = [...posts, ...watcherState.posts];
        watcherState.message = 'success';
        return feed;
      })
      .then((feed) => {
        state.message = '';
        setTimeout(() => postLoader(watcherState, feed), 5000);
      })
      .catch((err) => {
        if (err.isAxiosError) {
          watcherState.message = 'networkError';
        } else {
          watcherState.message = err.message;
        }
      });
  });
});
