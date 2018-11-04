import { getMessage } from '../../service/api'

export const getters = {
  Message: state => {
    return state.message
  }
}

export const mutations = {
  updateMessage (state) {
    getMessage().then(results => {
      state.message = results
    })
  }
}

export const actions = {
  loadMessage ({ commit }, msg) {
    commit('updateMessage', msg)
  }
}

export default {
  namespaced: true,
  state: {
    message: null
  },
  getters,
  mutations,
  actions
}
