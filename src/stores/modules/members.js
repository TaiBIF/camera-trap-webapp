import { getProjectMembers } from '../../service/api';

export const getters = {
  projectMembers: state => state.projectMembers,
};

export const mutations = {
  updateMembers(state, result) {
    state.projectMembers = result;
  },
};

export const actions = {
  async loadProjectMembers({ commit }, projectId) {
    const result = await getProjectMembers(projectId);
    commit('updateMembers', result);
  },
};

export default {
  namespaced: true,
  state: {
    projectMembers: [],
  },
  getters,
  mutations,
  actions,
};
