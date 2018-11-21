import fetchWrap from '../../util/fetch';

const getUserInfo = async () => {
  const res = await fetchWrap({
    url: '/ctp-user/me',
    method: 'GET',
  });

  return res.ret || {};
};

export { getUserInfo };
