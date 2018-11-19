import fetchWrap from '../../util/fetch';

const updateAbnormalCamera = async payload => {
  const res = await fetchWrap({
    url: '/abnormal-data/bulk-replace',
    method: 'POST',
    body: payload,
  });
  return res;
};

export { updateAbnormalCamera };
