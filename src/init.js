// import _ from 'lodash';
import * as onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import validator from './validator.js';
import render from './render.js';
import resources from './i18n/index';
import parser from './parser.js';

const proxy = 'https://hexlet-allorigins.herokuapp.com/get';
// const testUrl = 'http://lorem-rss.herokuapp.com/feed';
// const config = { disableCache: true };
const params = {
  disableCache: true,
  // url: 'http://lorem-rss.herokuapp.com/feed',
  url: 'http://lorem-rss.herokuapp.com',
};

export default () => i18next.init({
  lng: 'ru',
  debug: true,
  resources,
}).then(() => {
  const states = {
    form: {
      testUrl: 'https://ru.hexlet.io/lessons.rss',
      currentUrl: '',
      urls: [],
      status: '',
    },
    message: '',
  };

  const watcherState = onChange(states, (path, value) => render(watcherState, path, value));
  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    validator(formData.get('url')).then((resp) => {
      if (states.form.urls.includes(resp)) {
        watcherState.message = 'exists';
        throw new Error('already_exists');
      }
      watcherState.message = 'sucsses';
      return watcherState.form.urls.push(resp);
    }).then(() => axios.get(proxy, { params }))
      .then((resp) => {
        // console.log('axios resp');
        // console.log(resp);
        console.log('doc');
        parser(resp.data.contents);
      })
      .catch(() => {
        watcherState.form.status = 'false';
      });
  });
});
