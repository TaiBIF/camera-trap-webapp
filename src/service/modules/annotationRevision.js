import fetchWrap from '../../util/fetch';

const getRevision = async payload => {
  const res = await fetchWrap({
    url: '/annotation-revision/query',
    method: 'POST',
    body: {
      query: {
        _id: payload._id,
      },
      sort: {
        'revisions.created': 1,
      },
    },
  });

  return res.results[0];
};

const restoreRevision = async payload => {
  await fetchWrap({
    url: '/annotation-revision/restore',
    method: 'POST',
    body: payload,
  });
};

export { getRevision, restoreRevision };
