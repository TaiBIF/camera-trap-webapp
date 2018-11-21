import { getMessage, getNotifications } from '../../service/api';

export const getters = {
  Message: state => state.message,
  notifications: state => state.notifications,
};

export const mutations = {
  updateMessage(state, payload) {
    state.message = payload;
  },
  updateNotifications(state, payload) {
    state.notifications = payload;
  },
};

export const actions = {
  async loadMessage({ commit }) {
    const payload = await getMessage();
    commit('updateMessage', payload);
  },
  async loadNotifications({ commit }) {
    const payload = await getNotifications();
    commit('updateNotifications', payload);
  },
};

export default {
  namespaced: true,
  state: {
    message: null,
    notifications: [],
  },
  getters,
  mutations,
  actions,
};
