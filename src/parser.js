import _ from 'lodash';

const parser = (resp) => {
  // debugger;
  const data = new DOMParser();
  const parsData = data.parseFromString(resp, 'application/xml');
  if (parsData.querySelector('parsererror')) {
    throw Error('mustBeUrl');
  }
  return parsData;
};

const postBuilder = (post) => {
  const postTitle = post.querySelector('title').innerHTML;
  const postDescription = post.querySelector('description').innerHTML;
  const linkToOrigin = post.querySelector('link').innerHTML;
  const id = _.uniqueId();
  return {
    id, postTitle, postDescription, linkToOrigin,
  };
};

export default (rss, baseUrl) => {
  // debugger;
  const data = parser(rss);

  const title = data.querySelector('title').innerHTML;
  const description = data.querySelector('description').innerHTML;
  const posts = Array.from(data.querySelectorAll('item')).map(postBuilder);
  const result = { feed: { title, description, baseUrl }, posts };
  // console.log(result);
  return result;
};
