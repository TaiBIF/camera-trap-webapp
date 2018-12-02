import idx from 'idx';
import { getForestBoundary } from '../../service/api';

export const getters = {
  forestBoundary: state => state.forestBoundary,
};

export const mutations = {
  updateForestBoundary(state, payload) {
    state.forestBoundary = payload.map(obj => ({
      id: obj._id,
      visible: true,
      // TODO: response format check: https://github.com/TaiBIF/camera-trap-api/issues/45
      points: idx(obj, _ => _.geometry.coordinates[0][0]).map(coordinate => ({
        lng: coordinate[0],
        lat: coordinate[1],
      })),
    }));
  },
};

export const actions = {
  async loadForestBoundary({ commit }, { decimalLatitude, decimalLongitude }) {
    const payload = await getForestBoundary({
      decimalLatitude,
      decimalLongitude,
    });
    commit('updateForestBoundary', payload);
  },
};

export default {
  namespaced: true,
  state: {
    forestBoundary: [],
  },
  getters,
  mutations,
  actions,
};
