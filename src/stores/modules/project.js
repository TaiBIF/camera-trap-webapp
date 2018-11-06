import { getProjects, createProject } from '../../service/api'

export const getters = {
  Projects: state => {
    return state.projects
  },
  currentProject: state => {
    return state.projects.find(
      val => val.projectTitle === state.currentProjectId
    )
  },
  cameraLocations: (_, getters) => {
    if (!getters.currentProject.cameraLocations) return []

    const locations = getters.currentProject.cameraLocations.map(
      ({ site, subSite }) => ({ site, subSite })
    )

    const table = locations.reduce((accumulator, currentValue) => {
      // site 不存在
      if (!accumulator[currentValue.site]) {
        accumulator[currentValue.site] = {
          id: currentValue.site,
          name: currentValue.site,
          children: []
        }
      }

      // 判斷 subSite 是否存在
      if (
        !accumulator[currentValue.site].children.find(
          val => val.name === currentValue.subSite
        )
      ) {
        accumulator[currentValue.site].children.push({
          id: currentValue.subSite,
          name: currentValue.subSite
        })
      }

      return accumulator
    }, {})

    return Object.values(table)
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
