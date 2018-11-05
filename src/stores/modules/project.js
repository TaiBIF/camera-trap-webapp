import { getProjects } from '../../service/api'

export const getters = {
  Projects: state => {
    return state.projects
  }
}

export const mutations = {
  updateProjects (state) {
    getProjects().then(results => {
      state.projects = results
    })
  }
}

export const actions = {
  loadProject ({ commit }, proj) {
    commit('updateProjects', proj)
  }
}

export default {
  namespaced: true,
  state: {
    projects: []
  },
  getters,
  mutations,
  actions
}
