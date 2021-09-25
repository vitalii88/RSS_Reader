import _ from 'lodash';

const parser = (resp) => {
  const data = new DOMParser();
  const parsData = data.parseFromString(resp, 'application/xml');
  if (parsData.querySelector('parsererror')) {
    throw Error('networkError');
  }
  return parsData;
};

const postBuilder = (post) => {
  const postTitle = post.querySelector('title').textContent;
  const postDescription = post.querySelector('description').textContent;
  const linkToOrigin = post.querySelector('link').textContent;
  const id = _.uniqueId();
  return {
    id, postTitle, postDescription, linkToOrigin,
  };
};

export default (rss, baseUrl) => {
  const data = parser(rss);

  const title = data.querySelector('title').textContent;
  const description = data.querySelector('description').textContent;
  const posts = Array.from(data.querySelectorAll('item')).map(postBuilder);
  const result = { feed: { title, description, baseUrl }, posts };
  return result;
};
