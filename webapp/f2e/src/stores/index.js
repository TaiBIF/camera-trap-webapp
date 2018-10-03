import Vue from 'vue'
import Vuex from 'vuex'
import * as api from '../service/common'
import * as projectAPI from '../service/project'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fileReady: false,
    projects: [],
    message: null
  },
  getters: {
    FileReady: (state) => {
      return state.fileReady
    },
    Projects: (state) => {
      return state.projects
    },
    Message: (state) => {
      return state.message
    }
  },
  mutations: {
    updateFileReady(state, bool) {
      state.fileReady = bool
    },
    updateProjects(state) {
      projectAPI.getProjects().then((results) => {
        state.projects = results
      })
    },
    updateMessage(state) {
      api.getMessage().then((results) => {
        state.message = results
      })
    }
  },
  actions: {
    setFileReady: ({ commit }, bool) => {
      commit("updateFileReady", bool)
    },
    setProjects({ commit }, proj) {
      commit("updateProjects", proj)
    },
    setMessage({ commit }, msg) {
      commit("updateMessage", msg)
    }
  }
})
