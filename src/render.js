const input = document.getElementById('url-input');

const formStatus = (value) => {
  switch (value) {
    case 'false':
      input.classList.add('border', 'border-danger', 'border-2');
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

    default:
      throw new Error('invalid state');
  }
};
