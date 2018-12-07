import fetchWrap from '../../util/fetch';

const getUserInfo = async () => {
  const res = await fetchWrap({
    url: '/ctp-user/me',
    method: 'GET',
  });

  return res.ret || {};
};

const signOut = async () => {
  const res = await fetchWrap({
    url: '/ctp-user/sign-out',
    method: 'POST',
  });
  return res.ret;
};

export { getUserInfo, signOut };
