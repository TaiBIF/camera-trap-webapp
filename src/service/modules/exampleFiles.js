import fetchWrap from '../../util/fetch';

const projectExampleCsv = async payload => {
  const res = await fetchWrap({
    url: `/project/${payload}/example-multimedia-annotations.csv`,
    method: 'GET',
  });

  return res;
};

export { projectExampleCsv };
