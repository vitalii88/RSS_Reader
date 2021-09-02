import * as yup from 'yup';

yup.setLocale({
  string: {
    url: 'must_be_url',
  },
});

export default (url) => yup.string().url().required().validate(url);
