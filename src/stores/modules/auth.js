import { auth } from '../../util/auth/cognito-config';
import {
  getUserInfo,
  signOut,
  updateMyInfo,
  updateSpeciesKey,
} from '../../service/api';

export const getters = {
  isLogin: state => !!state.awsToken,
  loginUser: state => state.profile,
  projectRoles: state => (state.profile && state.profile.project_roles) || [],
  authCredentials: () => auth.credentials,
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
    // TODO: wait API adjust response format: https://github.com/TaiBIF/camera-trap-api/issues/33#issuecomment-447838361
    const data = await updateMyInfo(payload);
    commit('setNameAndEmail', data);
    commit('setSpeciesKeys', data.speciesKeys);
  },
  async updateSpeciesKey({ commit }, speciesKeys) {
    const data = await updateSpeciesKey(speciesKeys);
    commit('setSpeciesKeys', data.speciesKeys);
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
