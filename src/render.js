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

const buildPosts = (data) => {
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
    // button.dataset.id = e.id;
    // button.dataset.bsToggle = 'modal';
    // button.dataset.bsTarget = '#modal';
    button.textContent = i18next.t('view');

    button.addEventListener('click', () => {
      console.log('button click')
    })

    li.appendChild(button);
    ul.appendChild(li);
  });

  card.appendChild(ul);
  posts.appendChild(card);
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
      buildFeeds(value);
      break;

    case 'posts':
      buildPosts(value);
      break;

    default:
      throw new Error('invalid state');
  }
};
