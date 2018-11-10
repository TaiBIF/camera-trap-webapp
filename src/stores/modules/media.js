import { getSiteData } from '../../service/api'

export const getters = {
  Message: state => state.message
}

export const mutations = {
  updateSiteData (state, payload) {
    state.siteData = payload
  }
}

export const actions = {
  async getSiteData ({ commit }, payload) {
    const data = await getSiteData(payload)
    commit('updateSiteData', data)
  }
}

export default {
  namespaced: true,
  state: {
    siteData: null
  },
  getters,
  mutations,
  actions
}
