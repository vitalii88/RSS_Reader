import * as yup from 'yup';

export default (url) => yup.string().url().required().validate(url);
