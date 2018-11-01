import Vue from 'vue'
import Vuex from 'vuex'
import * as api from '../service/common'
import * as projectAPI from '../service/project'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pageLock: false,
    fileReady: false,
    projects: [],
    currentSite: 0,
    currentPoint: null,
    currentToggle: null,
    message: null,
    image_info: {
      carrier_url: '',
      title: '',
      bookmarklet: true,
      image_list: ["https://roadkill.tw/sites/roadkill/files/styles/species_photo/adaptive-image/public/bioclass/3c6d4f6a20e08ad47557b4fc5e67dbc8.jpg?itok=bnExmRy5"]
    }
  },
  getters: {
    ImageInfo: (state) => {
      return state.image_info
    },
    PageLock: (state) => {
      return state.pageLock
    },
    FileReady: (state) => {
      return state.fileReady
    },
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
    updatePageLock(state, bool) {
      state.pageLock = bool
    },
    updateFileReady(state, value) {
      state.fileReady = value
    },
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
    setPageLock: ({ commit }, bool) => {
      commit("updatePageLock", bool)
    },
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
