import i18next from 'i18next';
import 'bootstrap';

const msgColorStatus = (colorStatus, formElements) => {
  // debugger;
  switch (colorStatus) {
    case 'success':
      if (formElements.msgBlock.classList.contains('text-danger')) {
        formElements.msgBlock.classList.remove('text-danger');
      }
      formElements.msgBlock.classList.add('text-success');
      break;
    case 'danger':
      if (formElements.msgBlock.classList.contains('text-success')) {
        formElements.msgBlock.classList.remove('text-success');
      }
      formElements.msgBlock.classList.add('text-danger');
      break;
    default:
      throw new Error(`invalid state in msgColorStatus: ${colorStatus}`);
  }
};

const viewModal = (data, states) => {
  const watcherState = states;
  document.querySelector('.modal-title').innerHTML = data.title;
  document.querySelector('.modal-body').innerHTML = data.post;
  document.querySelector('.modal-footer > button').innerHTML = i18next.t('modalReadCancel');
  const a = document.querySelector('.modal-footer > a');
  a.setAttribute('href', data.id);
  a.innerHTML = i18next.t('modalReadButton');
  watcherState.readPost = [...watcherState.readPost, data.id];
};

const readPosts = (data) => {
  const postsList = document.querySelectorAll('a.fw-bold');
  data.forEach((e) => {
    postsList.forEach((link) => {
      if (link.dataset.id === e) {
        link.classList.remove('fw-bold');
        link.classList.add('fw-normal');
      }
    });
  });
};

const buildFeeds = (data) => {
  const feed = document.querySelector('.feeds');
  feed.innerHTML = '';
  const card = document.createElement('DIV');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('DIV');
  cardBody.classList.add('card-body');
  const h2 = document.createElement('H2');
  h2.innerHTML = i18next.t('uiFeed');
  cardBody.appendChild(h2);
  card.appendChild(cardBody);
  feed.appendChild(card);
  const ul = document.createElement('UL');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  data.forEach((e) => {
    const li = document.createElement('LI');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('H3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = e.title;
    li.appendChild(h3);
    const p = document.createElement('P');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.innerText = e.description;
    li.appendChild(p);
    ul.appendChild(li);
  });
  card.appendChild(ul);
};

const buildPosts = (data, states) => {
  const watcherState = states;
  const posts = document.querySelector('.posts');
  posts.innerHTML = '';
  const card = document.createElement('DIV');
  card.classList.add('card', 'border-0');

  const cardBoby = document.createElement('DIV');
  cardBoby.classList.add('card-body');
  const h2 = document.createElement('H2');
  h2.classList.add('card-title', 'h4');
  h2.innerHTML = i18next.t('post');
  cardBoby.appendChild(h2);
  card.appendChild(cardBoby);

  const ul = document.createElement('UL');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  data.forEach((e) => {
    const li = document.createElement('LI');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('A');
    a.setAttribute('href', e.linkToOrigin);
    a.setAttribute('data-id', e.id);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.classList.add('fw-bold');
    a.textContent = e.postTitle;
    li.appendChild(a);

    const button = document.createElement('BUTTON');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('data-bs-target', '#modal');
    button.setAttribute('type', 'button');
    button.setAttribute('data-id', e.id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.textContent = i18next.t('view');

    button.addEventListener('click', () => {
      const modalData = {
        title: e.postTitle,
        post: e.postDescription,
        link: e.linkToOrigin,
        id: e.id,
      };
      watcherState.modal = modalData;
    });

    li.appendChild(button);
    ul.appendChild(li);
  });

  card.appendChild(ul);
  posts.appendChild(card);
  readPosts(watcherState.readPost);
};

const formStatus = (value, formElements) => {
  // debugger;
  const elements = formElements;
  switch (value) {
    case 'null':
      break;

    case 'false':
      elements.input.classList.add('border', 'border-danger', 'border-2');
      break;

    case 'alreadyExists':
      msgColorStatus('danger', formElements);
      elements.msgBlock.textContent = i18next.t('alreadyExists');
      break;

    case 'success':
      msgColorStatus('success', formElements);
      elements.msgBlock.textContent = i18next.t('sucsses');
      break;

    case 'mustBeUrl':
      msgColorStatus('danger', formElements);
      elements.msgBlock.textContent = i18next.t('mustBeUrl');
      break;

    case 'networkError':
      msgColorStatus('danger', formElements);
      elements.msgBlock.textContent = i18next.t('networkError');
      break;

    default:
      throw new Error(`invalid state in formStatus value: ${value}`);
  }
};

const cleanInput = (formElement) => {
  const input = formElement;
  input.value = '';
  return input.onfocus;
};

export default (state, path, value, formElements) => {
  // debugger;
  switch (path) {
    case 'form.status':
      formStatus(value);
      break;

    case 'form.urls':
      cleanInput(formElements.input);
      break;

    case 'message':
      formStatus(value, formElements);
      break;

    case 'feeds':
      buildFeeds(value);
      break;

    case 'posts':
      buildPosts(value, state);
      break;

    case 'modal':
      viewModal(value, state);
      break;

    case 'readPost':
      readPosts(value);
      break;

    default:
      throw new Error(`invalid state in default path: ${path} value: ${value}`);
  }
};
