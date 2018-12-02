import fetchWrap from '../../util/fetch';

const getForestBoundary = async ({ decimalLatitude, decimalLongitude }) => {
  const res = await fetchWrap({
    url: '/forest-compartment-boundary',
    method: 'POST',
    body: {
      decimalLatitude,
      decimalLongitude,
    },
  });

  return res.ret || {};
};

export { getForestBoundary };
