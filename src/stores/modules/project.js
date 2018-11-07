import { getProjects, createProject, getSpeciesGroup } from '../../service/api'

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
    if (!getters.currentProject || !getters.currentProject.cameraLocations) {
      return []
    }

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
  },
  species: state => {
    return state.speciesGroup.species_group.map(val => ({
      name: val.species,
      y: val.count
    }))
  },
  // vue-select 使用的樣站資訊
  sites: (_, getters) => {
    // 格式同 cameraLocations 只是要替換 key， id -> value, name -> label
    const sites = getters.cameraLocations.reduce(
      (accumulator, currentValue) => {
        const tmp = {
          value: currentValue.id,
          label: currentValue.name,
          child: currentValue.children
            ? currentValue.children.map(val => ({
              value: val.id,
              label: val.name
            }))
            : []
        }
        accumulator.push(tmp)

        return accumulator
      },
      []
    )

    return [
      {
        value: '全部樣區',
        label: '全部樣區'
      },
      ...sites
    ]
  }
}

export const mutations = {
  updateProjects (state, payload) {
    state.projects = payload
  },
  setCurrentProject (state, payload) {
    state.currentProjectId = payload
  },
  setSpeciesGroup (state, payload) {
    state.speciesGroup = payload
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
  },
  async getSpeciesGroup ({ state, commit }) {
    const payload = await getSpeciesGroup(state.currentProjectId)
    commit('setSpeciesGroup', payload)
  }
}

export default {
  namespaced: true,
  state: {
    projects: [],
    currentProjectId: null,
    speciesGroup: {
      species_group: [],
      total: 0,
      modified: null
    }
  },
  getters,
  mutations,
  actions
}
