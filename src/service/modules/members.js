import fetchWrap from '../../util/fetch';

export const getProjectMembers = async projectId => {
  const { results } = await fetchWrap({
    url: `/project/${projectId}/members`,
    method: 'GET',
  });

  return results || [];
};

export const addProjectMember = async ({ projectId, orcId, roles }) => {
  const res = await fetchWrap({
    url: `/project/${projectId}/user/add/${orcId}`,
    method: 'POST',
    body: {
      roles,
    },
  });

  return res;
};

export const removeProjectMember = async ({ projectId, orcId }) => {
  const res = await fetchWrap({
    url: `/project/${projectId}/user/remove/${orcId}`,
    method: 'POST',
  });

  return res;
};
