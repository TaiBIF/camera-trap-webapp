import { getUploadHistory } from '../../service/api';

export const getters = {};

export const mutations = {
  updateUploadHistory(state, payload) {
    state.uploadHistory = payload;
  },
};

export const actions = {
  async getUploadHistory({ commit }) {
    const data = await getUploadHistory();
    commit('updateUploadHistory', data);
  },
};

export default {
  namespaced: true,
  state: {
    uploadHistory: [],
  },
  getters,
  mutations,
  actions,
};
