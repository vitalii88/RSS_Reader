const parser = (resp) => {
  const data = new DOMParser();
  const parsData = data.parseFromString(resp, 'application/xml');
  return (!parsData.querySelector('parsererror')) ? parsData : throw new Error('this is not RSS');
};

// const isRss = (parseData) => {
//   console.log(parseData);
//   if (!parseData.querySelector('rss')) {
//     throw new Error('this is not RSS');
//   }
// };

export default (rss) => {
  const data = parser(rss);
  // console.log(data);
  // isRss(data);
  // console.log(doc);
};
