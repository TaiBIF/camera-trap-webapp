import { getCameraLocked } from '../../service/api'

export const getters = {
  cameraLocked: state => {
    return state.cameraLocked.reduce((accumulator, currentValue) => {
      accumulator[currentValue.fullCameraLocationMd5] = {
        locked: currentValue.locked,
        lockedBy: currentValue.locked_by.name
      }
      return accumulator
    }, {})
  }
}

export const mutations = {
  updateCameraLocked (state, payload) {
    state.cameraLocked = payload
  }
}

export const actions = {
  async getCameraLocked ({ commit }, payload) {
    const data = await getCameraLocked(payload)
    commit('updateCameraLocked', data)
  }
}

export default {
  namespaced: true,
  state: {
    cameraLocked: []
  },
  getters,
  mutations,
  actions
}
