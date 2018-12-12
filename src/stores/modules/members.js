import { getProjectMembers } from '../../service/api';

export const getters = {
  members: state => state.members,
};

export const mutations = {
  updateMembers(state, { projectId, result }) {
    state.members[projectId] = result;
  },
};

export const actions = {
  async loadProjectMembers({ commit }, projectId) {
    const result = await getProjectMembers(projectId);
    commit('updateMembers', {
      projectId,
      result,
    });
  },
};

export default {
  namespaced: true,
  state: {
    members: {},
  },
  getters,
  mutations,
  actions,
};
