import fetchWrap from '../../util/fetch';

const getUploadHistory = async () => {
  const res = await fetchWrap({
    url: '/upload-session/mine',
    method: 'GET',
  });

  return res.ret || [];
};

export { getUploadHistory };
