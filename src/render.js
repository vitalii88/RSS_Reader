import i18next from 'i18next';

const input = document.getElementById('url-input');
const msgBlock = document.querySelector('#errMsg');

const msgColorStatus = (colorStatus) => {
  switch (colorStatus) {
    case 'success':
      if (msgBlock.classList.contains('text-danger')) {
        msgBlock.classList.remove('text-danger');
      }
      msgBlock.classList.add('text-success');
      break;
    case 'danger':
      if (msgBlock.classList.contains('text-success')) {
        msgBlock.classList.remove('text-success');
      }
      msgBlock.classList.add('text-danger');
      break;
    default:
      throw new Error('invalid');
  }
};

const buildFeeds = (data) => {
  // debugger;
  console.log('data => ', data);
  const feed = document.querySelector('.feeds');
  feed.innerHTML = '';
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.innerHTML = i18next.t('uiFeed');
  cardBody.appendChild(h2);
  card.appendChild(cardBody);
  feed.appendChild(card);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  data.forEach((e) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = e.title;
    li.appendChild(h3);
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.innerText = e.description;
    li.appendChild(p);
    ul.appendChild(li);
  });
  card.appendChild(ul);
};

const formStatus = (value) => {
  switch (value) {
    case 'false':
      input.classList.add('border', 'border-danger', 'border-2');
      break;

    case 'alreadyExists':
      msgBlock.textContent = i18next.t('alreadyExists');
      msgColorStatus('danger');
      break;

    case 'success':
      msgBlock.textContent = i18next.t('sucsses');
      msgColorStatus('success');
      break;

    case 'mustBeUrl':
      msgBlock.textContent = i18next.t('mustBeUrl');
      msgColorStatus('danger');
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
  // debugger;
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

    case 'feeds':
      // console.log('feeds => ', value);
      // делаем рендер фидов
      buildFeeds(value);
      break;

    case 'posts':
      // console.log('posts => ', value);
      break;

    default:
      throw new Error('invalid state');
  }
};
