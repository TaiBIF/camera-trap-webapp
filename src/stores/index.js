import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import project from './modules/project';
import message from './modules/message';
import media from './modules/media';
import cameraLocation from './modules/cameraLocation';
import uploadSession from './modules/uploadSession';
import annotationRevision from './modules/annotationRevision';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    project,
    message,
    media,
    cameraLocation,
    uploadSession,
    annotationRevision,
  },
  state: {
    pageLock: false,
    fileReady: false,
    currentSite: 0,
    currentPoint: null,
    currentToggle: null,
    image_info: {
      carrier_url: '',
      title: '',
      bookmarklet: true,
      image_list: [
        'https://roadkill.tw/sites/roadkill/files/styles/species_photo/adaptive-image/public/bioclass/3c6d4f6a20e08ad47557b4fc5e67dbc8.jpg?itok=bnExmRy5',
      ],
    },
  },
  getters: {
    ImageInfo: state => {
      return state.image_info;
    },
    PageLock: state => {
      return state.pageLock;
    },
    FileReady: state => {
      return state.fileReady;
    },
    CurrentToggle: state => {
      return state.currentToggle;
    },
    CurrentSite: state => {
      return state.currentSite;
    },
    CurrentPoint: state => {
      return state.currentPoint;
    },
  },
  mutations: {
    updatePageLock(state, bool) {
      state.pageLock = bool;
    },
    updateFileReady(state, value) {
      state.fileReady = value;
    },
    updateCurrentToggle(state, num) {
      state.currentToggle = num;
    },
    updateCurrentSite(state, num) {
      state.currentSite = num;
    },
    updateCurrentPoint(state, num) {
      state.currentPoint = num;
    },
  },
  actions: {
    setPageLock: ({ commit }, bool) => {
      commit('updatePageLock', bool);
    },
    setCurrentToggle: ({ commit }, no) => {
      commit('updateCurrentToggle', no);
    },
    setCurrentSite: ({ commit }, no) => {
      commit('updateCurrentSite', no);
    },
    setCurrentPoint: ({ commit }, no) => {
      commit('updateCurrentPoint', no);
    },
    setFileReady: ({ commit }, bool) => {
      commit('updateFileReady', bool);
    },
  },
});
