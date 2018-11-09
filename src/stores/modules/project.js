import L from 'leaflet'
import {
  getProjects,
  createProject,
  getSpeciesGroup,
  getLocationIdentifiedStatus,
  getLocationRetrievedStatus,
  getLocationAbnormalStatus
} from '../../service/api'

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
  },
  ProjectMarkers: state => {
    // siteStatusTab, 0 = 影像回收狀況, 1 = 影像辨識進度
    const source =
      state.siteStatusTab === 0
        ? state.locationRetrievedStatus
        : state.locationIdentifiedStatus

    return source.map(val => ({
      id: val._id,
      name: val.site,
      project_id: val.projectTitle,
      marker: L.latLng(val.wgs84dec_y, val.wgs84dec_x),
      progress: val.monthly_num.reduce((accumulator, currentValue) => {
        accumulator[currentValue.month] = currentValue.num
        return accumulator
      }, Array(12).fill(0))
    }))
  },
  SiteMarkers: state => {
    return [
      {
        id: 11,
        name: 'PT07A',
        takeback: 2250,
        num: 106,
        last_update: '2017/05/23 15:22',
        error: 5,
        marker: L.latLng(24.611081, 121.605761),
        color: 'green',
        progress: [2, 1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0]
      },
      {
        id: 12,
        name: 'PT08A',
        takeback: 5250,
        num: 20,
        last_update: '2017/05/23 15:22',
        error: 0,
        marker: L.latLng(24.607959, 121.601986),
        color: 'red',
        progress: [2, 1, 0, 0, 2, -1, -1, -1, -1, 0, 0, 0]
      },
      {
        id: 13,
        name: 'PT09A',
        takeback: 2250,
        num: 106,
        last_update: '2017/05/23 15:22',
        error: 5,
        marker: L.latLng(24.607023, 121.60396),
        color: 'green',
        progress: [2, 1, 2, -1, -1, -1, -1, -1, -1, 0, 0, 0]
      },
      {
        id: 14,
        name: 'PT10A',
        takeback: 5250,
        num: 20,
        last_update: '2017/05/23 15:22',
        error: 0,
        marker: L.latLng(24.611939, 121.60722),
        color: 'red',
        progress: [2, 1, 1, 1, -1, -1, -1, -1, -1, 0, 0, 0]
      }
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
  },
  setLocationIdentifiedStatus (state, payload) {
    state.locationIdentifiedStatus = payload
  },
  setLocationRetrievedStatus (state, payload) {
    state.locationRetrievedStatus = payload
  },
  setLocationCameraAbnormalStatus (state, payload) {
    state.locationCameraAbnormalStatus = payload
  },
  setSiteStatusTab (state, payload) {
    state.siteStatusTab = payload
  }
}

export const actions = {
  // 讀取計畫列表
  async loadProject ({ commit }) {
    const data = await getProjects()
    commit('updateProjects', data)
  },
  // 新增計畫
  async createProject ({ dispatch }, payload) {
    await createProject(payload)
    dispatch('loadProject')
  },
  // 取得辨識物種列表
  async getSpeciesGroup ({ state, commit }) {
    const data = await getSpeciesGroup(state.currentProjectId)
    commit('setSpeciesGroup', data)
  },
  // 影像辨識狀況
  async getLocationIdentifiedStatus ({ state, commit }, payload) {
    const data = await getLocationIdentifiedStatus({
      projectTitle: state.currentProjectId,
      ...payload
    })
    commit('setLocationIdentifiedStatus', data)
  },
  // 影像回收狀況
  async getLocationRetrievedStatus ({ state, commit }, payload) {
    const data = await getLocationRetrievedStatus({
      projectTitle: state.currentProjectId,
      ...payload
    })
    commit('setLocationRetrievedStatus', data)
  },
  // 相機異常值
  async getLocationCameraAbnormalStatus ({ state, commit }, payload) {
    const data = await getLocationAbnormalStatus({
      projectTitle: state.currentProjectId,
      ...payload
    })
    commit('setLocationCameraAbnormalStatus', data)
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
    },
    locationIdentifiedStatus: [],
    locationRetrievedStatus: [],
    locationCameraAbnormalStatus: [],
    // 畫面用
    siteStatusTab: 0
  },
  getters,
  mutations,
  actions
}
