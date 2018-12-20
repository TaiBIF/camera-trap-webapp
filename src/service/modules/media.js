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
        uploaded_file_name: true,
        type: true,
        youtube_url: true,
      },
      sort: [
        ['cameraLocation', 1],
        ['date_time_corrected_timestamp', 1],
        ['uploaded_file_name', 1],
      ],
    }),
  });

  return res.results.map(val => ({
    ...val,
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
