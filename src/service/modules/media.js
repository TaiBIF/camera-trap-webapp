import fetchWrap from '../../util/fetch';

const getSiteData = async payload => {
  if (payload.projectOnly) {
    return [];
  }
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
        'tokens.species_shortcut': true,
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

const replicateToken = async payload => {
  const { annotationId, tokenIndex } = payload;
  const res = await fetchWrap({
    url: `/media/annotation/${annotationId}/token/${tokenIndex}/replicate`,
    method: 'POST',
    body: payload,
  });
  return res;
};

const deleteToken = async payload => {
  const { annotationId, tokenIndex } = payload;
  const res = await fetchWrap({
    url: `/media/annotation/${annotationId}/token/${tokenIndex}/delete`,
    method: 'POST',
    body: payload,
  });
  return res;
};

const countSiteData = async payload => {
  const { query } = payload;
  const res = await fetchWrap({
    url: '/media/annotation/doc-count',
    method: 'POST',
    body: Object.assign({}, { query }),
  });

  return res.count;
};

const scanSiteData = async payload => {
  const res = await fetchWrap({
    url: '/media/annotation/query',
    method: 'POST',
    body: payload,
  });

  return res;
};

export {
  getSiteData,
  updateAnnotation,
  replicateToken,
  deleteToken,
  countSiteData,
  scanSiteData,
};
