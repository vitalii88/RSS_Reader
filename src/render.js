import i18next from 'i18next';

const input = document.getElementById('url-input');
const msgBlock = document.querySelector('#errMsg');

const formStatus = (value) => {
  switch (value) {
    case 'false':
      input.classList.add('border', 'border-danger', 'border-2');
      break;

    case 'exists':
      msgBlock.textContent = i18next.t('already_exists');
      if (msgBlock.classList.contains('text-success')) {
        msgBlock.classList.remove('text-success');
      }
      msgBlock.classList.add('text-danger');
      break;

    case 'sucsses':
      msgBlock.textContent = i18next.t('sucsses');
      if (msgBlock.classList.contains('text-danger')) {
        msgBlock.classList.remove('text-danger');
      }
      msgBlock.classList.add('text-success');
      break;

    default:
      throw new Error('invalid state');
  }
};

const cleanInput = () => {
  input.value = '';
  return input.onfocus;
};

export default (state, path, value) => {
  switch (path) {
    case 'form.status':
      formStatus(value);
      break;

    case 'form.urls':
      cleanInput();
      break;

    case 'message':
      formStatus(value);
      break;

    default:
      throw new Error('invalid state');
  }
};
