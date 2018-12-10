import { getDataFieldAvailable } from '../../service/api';

export const getters = {
  dataFieldAvailable: state => state.dataFieldAvailable,
};

export const mutations = {
  updateDataFieldAvailable(state, payload) {
    state.dataFieldAvailable = payload;
  },
};

export const actions = {
  async loadDataFieldAvailable({ commit }) {
    const data = await getDataFieldAvailable();
    if (data) {
      commit('updateDataFieldAvailable', data);
    }
  },
};

export default {
  namespaced: true,
  state: {
    dataFieldAvailable: [],
  },
  getters,
  mutations,
  actions,
};
