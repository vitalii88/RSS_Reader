// import _ from 'lodash';
import * as onChange from 'on-change';
import i18next from 'i18next';
import validator from './validator.js';
import render from './render.js';
import resources from './i18n/index';

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
    }).catch(() => {
      watcherState.form.status = 'false';
    });
  });
});
