import * as yup from 'yup';

yup.setLocale({
  string: {
    url: 'mustBeUrl',
  },
});

export default (url) => yup.string().url().required().validate(url);
