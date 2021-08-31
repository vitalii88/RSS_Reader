// import _ from 'lodash';
import * as onChange from 'on-change';
import validator from './validator.js';
import render from './render.js';

export default () => {
  const states = {
    form: {
      testUrl: 'https://ru.hexlet.io/lessons.rss',
      currentUrl: '',
      urls: [],
      status: '',
    },
  };

  const watcherState = onChange(states, (path, value) => render(watcherState, path, value));
  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    validator(formData.get('url')).then((resp) => {
      if (states.form.urls.includes(resp)) {
        throw new Error('already_exists');
      }
      return watcherState.form.urls.push(resp);
    }).catch(() => {
      watcherState.form.status = 'false';
    });
  });
};
