import Vue from 'vue'
import Vuex from 'vuex'
import * as api from '../service/common'
import * as projectAPI from '../service/project'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    fileReady: false,
    projects: [],
    currentSite: 0,
    currentPoint: null,
    currentToggle: null,
    message: null
  },
  getters: {
    CurrentToggle: (state) => {
      return state.currentToggle
    },
    CurrentSite: (state) => {
      return state.currentSite
    },
    CurrentPoint: (state) => {
      return state.currentPoint
    },
    Projects: (state) => {
      return state.projects
    },
    Message: (state) => {
      return state.message
    }
  },
  mutations: {
    updateCurrentToggle(state, num) {
      state.currentToggle = num
    },
    updateCurrentSite(state, num) {
      state.currentSite = num
    },
    updateCurrentPoint(state, num) {
      state.currentPoint = num
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
    setCurrentToggle: ({ commit }, no) => {
      commit("updateCurrentToggle", no)
    },
    setCurrentSite: ({ commit }, no) => {
      commit("updateCurrentSite", no)
    },
    setCurrentPoint: ({ commit }, no) => {
      commit("updateCurrentPoint", no)
    },
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
