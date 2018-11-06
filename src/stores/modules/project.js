import { getProjects, createProject } from '../../service/api'

export const getters = {
  Projects: state => {
    return state.projects
  }
}

export const mutations = {
  updateProjects (state, payload) {
    state.projects = payload
  }
}

export const actions = {
  async loadProject ({ commit }) {
    const payload = await getProjects()
    commit('updateProjects', payload)
  },
  async createProject ({ dispatch }, payload) {
    await createProject(payload)
    dispatch('loadProject')
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
