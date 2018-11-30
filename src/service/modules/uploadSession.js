import fetchWrap from '../../util/fetch';

const getUploadHistory = async () => {
  const res = await fetchWrap({
    url: '/upload-session/mine',
    method: 'GET',
  });

  return res.ret || [];
};

const updateUploadStatus = async body => {
  const res = await fetchWrap({
    url: '/upload-session/bulk-update',
    method: 'POST',
    body,
  });

  return res;
};

export { getUploadHistory, updateUploadStatus };
