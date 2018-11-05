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
    await createProject({
      id: 2,
      name: '林務局2',
      start_at: 2019,
      agency: '林務局2',
      members: 172
    })
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
