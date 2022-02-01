import i18next from 'i18next';
import 'bootstrap';

const setTextColor = (colorStatus, formElements) => {
  switch (colorStatus) {
    case 'success':
      formElements.msgBlock.classList.remove('text-danger');
      formElements.msgBlock.classList.add('text-success');
      break;
    case 'danger':
      formElements.msgBlock.classList.remove('text-success');
      formElements.msgBlock.classList.add('text-danger');
      break;
    default:
      throw new Error(`invalid state in setTextColor: ${colorStatus}`);
  }
};

const showModal = (data, state) => {
  // const watcherState = state;
  document.querySelector('.modal-title').innerHTML = data.title;
  document.querySelector('.modal-body').innerHTML = data.post;
  document.querySelector('.modal-footer > button').innerHTML = i18next.t('modal.modalReadCancel');
  const a = document.querySelector('.modal-footer > a');
  a.setAttribute('href', data.link);
  a.innerHTML = i18next.t('modal.modalReadButton');
  state.readPost = [...state.readPost, data.id];
};

const markPostAsRead = (data) => {
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

const isDisableFormElement = (action = 'unblock', formElements) => {
  const elements = formElements;
  if (action === 'block') {
    elements.submitBtn.disabled = true;
    elements.input.readOnly = true;
  } else {
    elements.submitBtn.disabled = false;
    elements.input.readOnly = false;
    elements.input.disabled = false;
  }
};

const buildFeeds = (data) => {
  const feed = document.querySelector('.feeds');
  feed.innerHTML = '';
  const card = document.createElement('DIV');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('DIV');
  cardBody.classList.add('card-body');
  const h2 = document.createElement('H2');
  h2.innerHTML = i18next.t('ui.uiFeed');
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
    p.textContent = e.description;
    li.appendChild(p);
    ul.appendChild(li);
  });
  card.appendChild(ul);
};

const buildPosts = (data, state) => {
  const watcherState = state;
  const posts = document.querySelector('.posts');
  posts.innerHTML = '';
  const card = document.createElement('DIV');
  card.classList.add('card', 'border-0');

  const cardBoby = document.createElement('DIV');
  cardBoby.classList.add('card-body');
  const h2 = document.createElement('H2');
  h2.classList.add('card-title', 'h4');
  h2.innerHTML = i18next.t('ui.post');
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
    button.textContent = i18next.t('ui.view');

    button.addEventListener('click', () => {
      watcherState.modal = {
        title: e.postTitle,
        post: e.postDescription,
        link: e.linkToOrigin,
        id: e.id,
      };
    });

    a.addEventListener('click', () => {
      watcherState.modal = {
        id: e.id,
      };
    });

    li.appendChild(button);
    ul.appendChild(li);
  });

  card.appendChild(ul);
  posts.appendChild(card);
  markPostAsRead(watcherState.readPost);
};

const cleanInput = (formElement) => {
  const input = formElement;
  input.value = '';
};

const formStatus = (value, formElements) => {
  const elements = formElements;
  switch (value) {
    case 'null':
      break;

    case 'alreadyExists':
      setTextColor('danger', elements);
      elements.msgBlock.textContent = i18next.t('message.alreadyExists');
      isDisableFormElement('unblock', elements);
      break;

    case 'success':
      setTextColor('success', elements);
      isDisableFormElement('unblock', elements);
      cleanInput(elements.input);

      elements.msgBlock.textContent = i18next.t('message.sucsses');
      break;

    case 'mustBeUrl':
      setTextColor('danger', elements);
      elements.msgBlock.textContent = i18next.t('message.mustBeUrl');
      isDisableFormElement('unblock', elements);
      break;

    case 'mustBeRss':
      setTextColor('danger', elements);
      elements.msgBlock.textContent = i18next.t('message.mustBeRss');
      isDisableFormElement('unblock', elements);
      break;

    case 'networkError':
      setTextColor('danger', elements);
      elements.msgBlock.textContent = i18next.t('message.networkError');
      break;

    case 'dispatch':
      isDisableFormElement('block', elements);
      break;

    default:
      throw new Error(`invalid state in formStatus value: ${value}`);
  }
};

const disableInput = (formElement) => {
  const input = formElement;
  input.disabled = true;
  return input.onfocus;
};

export default (state, path, value, formElements) => {
  switch (path) {
    case 'form.status':
      formStatus(value, formElements, state);
      break;

    case 'form.urls':
      disableInput(formElements.input);
      break;

    case 'feeds':
      buildFeeds(value);
      break;

    case 'posts':
      buildPosts(value, state);
      break;

    case 'modal':
      showModal(value, state);
      break;

    case 'readPost':
      markPostAsRead(value);
      break;

    default:
      throw new Error(`invalid state in default path: ${path} value: ${value}`);
  }
};
