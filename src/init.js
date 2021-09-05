// import _ from 'lodash';
import * as onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import validator from './validator.js';
import render from './render.js';
import resources from './i18n/index';
import parser from './parser.js';

const proxy = 'https://hexlet-allorigins.herokuapp.com/get';
// const curentUrl = 'http://lorem-rss.herokuapp.com/feed';
const config = {
  disableCache: true,
  // url: 'http://lorem-rss.herokuapp.com/feed',
  // url: curentUrl,
};

export default () => i18next.init({
  lng: 'ru',
  debug: true,
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
  };

  const watcherState = onChange(states, (path, value) => render(watcherState, path, value));
  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    validator(formData.get('url')).then((resp) => {
      // console.log('111111');
      console.log('first  step => ', resp);
      states.form.currentUrl = resp;
      // проверка на дубликаты
      if (states.form.urls.includes(resp)) {
        // console.log('111111');
        watcherState.message = 'alreadyExists';
        throw new Error('alreadyExists');
      }
      watcherState.message = 'success';
      return watcherState.form.urls.push(resp);
    }).then(() => axios.get(proxy, { params: { url: states.form.currentUrl, ...config } }))
      .then((resp) => {
        // console.log(resp);

        const { feed, posts } = parser(resp.data.contents);
        console.log(feed);
        console.log(posts);
        watcherState.feeds = [feed, ...watcherState.feeds];
        watcherState.posts = [...posts, ...watcherState.posts];
      })
      .then(() => {
        console.log();
      })
      .catch((err) => {
        console.log('catch err => ', err.message);
        watcherState.message = err.message;
      });
  });
});
