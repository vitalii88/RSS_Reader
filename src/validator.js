import * as yup from 'yup';

yup.setLocale({
  string: {
    url: 'mustBeUrl',
  },
});

export default (url, urls) => yup.string().url().notOneOf(urls).required()
  .validate(url);
