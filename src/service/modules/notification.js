import fetchWrap from '../../util/fetch';

const getNotifications = async () => {
  const res = await fetchWrap({
    url: '/announcement/notifications',
    method: 'GET',
  });

  return res.ret || [];
};

export { getNotifications };
