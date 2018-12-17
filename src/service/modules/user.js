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

const updateUserInfo = async payload => {
  const res = await fetchWrap({
    url: '/ctp-user/bulk-update',
    method: 'POST',
    body: payload,
  });
  return res.ret;
};
const updateSpeciesKey = async speciesKeys => {
  const res = await fetchWrap({
    url: '/ctp-user/me/update',
    method: 'PATCH',
    body: {
      speciesKeys,
    },
  });
  return res.ret;
};

export { getUserInfo, signOut, updateUserInfo, updateSpeciesKey };
