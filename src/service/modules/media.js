import fetchWrap from '../../util/fetch';

const getSiteData = async payload => {
  const res = await fetchWrap({
    url: '/media/annotation/query',
    method: 'POST',
    body: Object.assign({}, payload, {
      // 給後端的寫死值
      projection: {
        projectId: true,
        projectTitle: true,
        site: true,
        subSite: true,
        cameraLocation: true,
        fullCameraLocationMd5: true,
        'tokens.data.key': true,
        'tokens.data.label': true,
        'tokens.data.value': true,
        corrected_date_time: true,
        date_time_corrected_timestamp: true,
        url: true,
        low_quality_url: true,
        imageUrlPrefix: true,
      },
    }),
  });

  return res.results.map(val => ({
    ...val,
    url: `${val.imageUrlPrefix}${val.url}`,
    lowQualityUrl: `${val.imageUrlPrefix}${val.low_quality_url}`,
  }));
};

const updateAnnotation = async payload => {
  const res = await fetchWrap({
    url: '/media/annotation/bulk-update',
    method: 'POST',
    body: payload,
  });
  return res;
};

export { getSiteData, updateAnnotation };
