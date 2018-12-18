import { auth } from '../../util/auth/cognito-config';
import {
  getUserInfo,
  signOut,
  updateUserInfo,
  updateSpeciesKey,
} from '../../service/api';

export const getters = {
  isLogin: state => !!state.awsToken,
  loginUser: state => state.profile,
  projectRoles: state => (state.profile && state.profile.project_roles) || [],
};

export const mutations = {
  setToken(state, payload) {
    state.awsToken = payload;
  },
  setProfile(state, payload) {
    state.profile = payload;
  },
  setNameAndEmail(state, payload) {
    state.profile = {
      ...state.profile,
      ...payload,
    };
  },
  setSpeciesKeys(state, payload) {
    state.profile.speciesKeys = payload;
  },
};

export const actions = {
  async doLogin() {
    auth.getSession();
  },
  async doSignOut() {
    await signOut();
    auth.signOut();
  },
  async loadProfile({ commit }) {
    const data = await getUserInfo();
    commit('setProfile', data);
  },
  async updateProfile({ commit }, payload) {
    await updateUserInfo(payload);
    // TODO: wait API adjust response format: https://github.com/TaiBIF/camera-trap-api/issues/33#issuecomment-447838361
    const data = payload[0].$set;
    commit('setNameAndEmail', data);
  },
  async updateSpeciesKey({ commit }, speciesKeys) {
    const data = await updateSpeciesKey(speciesKeys);
    // TODO: check API response and update to store
    console.log('resetSpeciesKey', data);
    commit('setSpeciesKeys', speciesKeys);
  },
};

export default {
  namespaced: true,
  state: {
    awsToken: null,
    profile: {},
  },
  getters,
  mutations,
  actions,
};
