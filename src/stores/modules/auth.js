import { auth } from '../../util/auth/cognito-config'

export const getters = {
  isLogin: state => () => !!state.awsToken
}

export const mutations = {}

export const actions = {
  async doLogin () {
    auth.getSession()
  },
  async doSignOut () {
    auth.signOut()
  }
}

export default {
  namespaced: true,
  state: {
    awsToken: null
  },
  getters,
  mutations,
  actions
}
