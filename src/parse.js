export default (resp) => {
  const data = new DOMParser();
  const xmlDecodeData = data.parseFromString(resp, 'application/xml');
  if (xmlDecodeData.querySelector('parsererror')) {
    throw Error('mustBeRss');
  }
  return xmlDecodeData;
};
