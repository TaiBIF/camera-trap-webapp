import { getMessage } from '../../service/api';

export const getters = {
  Message: state => state.message,
};

export const mutations = {
  updateMessage(state, payload) {
    state.message = payload;
  },
};

export const actions = {
  async loadMessage({ commit }) {
    const payload = await getMessage();
    commit('updateMessage', payload);
  },
};

export default {
  namespaced: true,
  state: {
    message: null,
  },
  getters,
  mutations,
  actions,
};
