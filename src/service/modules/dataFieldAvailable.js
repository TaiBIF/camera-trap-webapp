import fetchWrap from '../../util/fetch';

const getDataFieldAvailable = async () => {
  return await fetchWrap({
    url: '/data-field-available',
    method: 'GET',
  });
};

export { getDataFieldAvailable };
