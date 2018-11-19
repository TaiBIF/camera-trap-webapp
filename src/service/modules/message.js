import fetchWrap from '../../util/fetch';

const getMessage = async () => {
  const res = await fetchWrap({
    url: '/announcement/query',
    method: 'POST',
    body: {
      query: {},
      limit: 3,
      sort: { modified: -1 },
    },
  });

  return res.results.map(val => ({
    id: val.announcement_id,
    title: val.message,
  }));
};

export { getMessage };
