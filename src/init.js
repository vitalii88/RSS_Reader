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

  const watcherState = onChange(states, (path, value) => render(watcherState, path, value));
  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    validator(formData.get('url')).then((resp) => {
      states.form.currentUrl = resp;
      if (states.form.urls.includes(resp)) {
        watcherState.message = 'alreadyExists';
        throw new Error('alreadyExists');
      }
      watcherState.message = 'success';
      return watcherState.form.urls.push(resp);
    }).then(() => axios.get(proxy, { params: { url: states.form.currentUrl, ...config } }))
      .then((resp) => {
        const { feed, posts } = parser(resp.data.contents, states.form.currentUrl);
        watcherState.feeds = [feed, ...watcherState.feeds];
        watcherState.posts = [...posts, ...watcherState.posts];
        setTimeout(() => postLoader(watcherState, feed), 5000);
      })
      .catch((err) => {
        watcherState.message = err.message;
      });
  });
});
