import { getProjects, createProject } from '../../service/api'

export const getters = {
  Projects: state => {
    return state.projects
  },
  currentProject: state => {
    return state.projects.find(val => val.project === state.currentProjectId)
  }
}

export const mutations = {
  updateProjects (state, payload) {
    state.projects = payload
  },
  setCurrentProject (state, payload) {
    state.currentProjectId = payload
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
    projects: [],
    currentProjectId: null
  },
  getters,
  mutations,
  actions
}
