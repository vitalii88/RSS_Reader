import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import validator from './validator.js';
import render from './render.js';
import resources from './i18n/index';
import parser from './parser.js';

const proxy = 'https://hexlet-allorigins.herokuapp.com/get';
const config = {
  disableCache: true,
};

const postLoader = (states, feds) => {
  const watcherState = states;
  const { baseUrl } = feds;

  axios.get(proxy, { params: { url: baseUrl, ...config } })
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
// const form = document.querySelector('form');
// const formElements = {
//   form: document.querySelector('form'),
//   input: document.getElementById('url-input'),
//   msgBlock: document.querySelector('.feedback'),
//   submitBtn: document.querySelector('button[type="submit"]'),
// };

export default () => i18next.init({
  lng: 'ru',
  debug: false,
  resources,
}).then(() => {
  const formElements = {
    form: document.querySelector('form'),
    input: document.getElementById('url-input'),
    msgBlock: document.querySelector('.feedback'),
    submitBtn: document.querySelector('button[type="submit"]'),
  };

  const watcherState = onChange(state, (path, value) => {
    const view = render(watcherState, path, value, formElements);
    return view;
  });

  formElements.form.addEventListener('submit', (e) => {
  // form.addEventListener('submit', (e) => {
    e.preventDefault();
    formElements.submitBtn.disabled = true;
    formElements.input.readOnly = true;
    formElements.input.disabled = true;
    const formData = new FormData(formElements.form);

    validator(formData.get('url'), state.form.urls).then((resp) => {
      // debugger;
      state.form.currentUrl = resp;
      if (state.form.urls.includes(resp)) {
        watcherState.message = 'alreadyExists';
        throw new Error('alreadyExists');
      }
      watcherState.form.urls.push(resp);
    }).then(() => axios.get(proxy, { params: { url: state.form.currentUrl, ...config } }))
      .then((axiosResp) => parser(axiosResp.data.contents, state.form.currentUrl))
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
        watcherState.message = 'waiting';
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
