import fetchWrap from '../../util/fetch';

export const getProjectMembers = async projectId => {
  const { results } = await fetchWrap({
    url: `/project/${projectId}/members`,
    method: 'GET',
  });

  return results || [];
};
