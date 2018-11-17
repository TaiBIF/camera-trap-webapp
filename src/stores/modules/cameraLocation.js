import { getCameraLocked, setCameraLocked } from '../../service/api'

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
  },
  setCameraUpdatePayload (state, payload) {
    state.cameraUpdatePayload = payload
  }
}

export const actions = {
  async getCameraLocked ({ commit }, payload) {
    commit('setCameraUpdatePayload', payload)
    const data = await getCameraLocked(payload)
    commit('updateCameraLocked', data)
  },
  async setCameraLocked ({ dispatch, state }, payload) {
    await setCameraLocked(payload)
    dispatch('getCameraLocked', state.cameraUpdatePayload)
  }
}

export default {
  namespaced: true,
  state: {
    cameraUpdatePayload: {}, // 更新相機鎖定資訊，為了要設定後可以再次更新先暫存
    cameraLocked: []
  },
  getters,
  mutations,
  actions
}
