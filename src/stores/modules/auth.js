import { auth } from '../../util/auth/cognito-config';
import { getUserInfo, signOut } from '../../service/api';

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
