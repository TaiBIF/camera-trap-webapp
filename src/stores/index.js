import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import project from './modules/project';
import message from './modules/message';
import media from './modules/media';
import cameraLocation from './modules/cameraLocation';
import dataFieldAvailable from './modules/dataFieldAvailable';
import uploadSession from './modules/uploadSession';
import annotationRevision from './modules/annotationRevision';
import forestBoundary from './modules/forestBoundary';
import exampleFiles from './modules/exampleFiles';
import members from './modules/members';

import moment from 'moment';
import axios from 'axios';

import api from './api';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    project,
    message,
    media,
    cameraLocation,
    dataFieldAvailable,
    uploadSession,
    annotationRevision,
    forestBoundary,
    exampleFiles,
    members,
  },
  state: {
    pageLock: false,
    fileReady: false,
    currentSite: null,
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
    calcForm: {},
    calcFormResult: [],
    isCalcFormLoading: true,
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

    CALC_FORM(state, calcForm) {
      state.calcForm = calcForm;
    },

    CALC_FORM_SUCCESS(state, csv) {
      state.calcFormResult = csv;
      state.isCalcFormLoading = false;
    },

    CALC_FORM_STARTING(state) {
      state.isCalcFormLoading = true;
    },
  },
  actions: {
    async calcForm(ctx) {
      return new Promise(async resolve => {
        const {
          site,
          subSite,
          project,
          effectiveTimeInterval,
          fromDate,
          fromTime,
          toDate,
          toTime,
          camera,
          ...form
        } = ctx.state.calcForm;

        const data = {
          site,
          subSite,
          effectiveTimeInterval,
          projectId: project._id,
          species: form.species,
          fromDateTime: `${moment(fromDate).format('YYYY-MM-DD')} ${
            fromTime.HH
          }:${fromTime.mm}`,
          toDateTime: `${moment(toDate).format('YYYY-MM-DD')} ${toTime.HH}:${
            toTime.mm
          }`,
          fullCameraLocationMd5: camera.map(c => c.fullCameraLocationMd5),
        };

        ctx.commit('CALC_FORM_STARTING');

        // const delayData = {
        //   projectId: 'd8064aa7-9643-44fb-bed9-1f23a690f968',
        //   site: '臺東處',
        //   subSite: 'NULL',
        //   species: '山羌',
        //   fromDateTime: '2018-01-05 13:00:00',
        //   toDateTime: '2018-03-31 23:59:59',
        //   fullCameraLocationMd5s: [
        //     'ba59a7c8d7474b301d44d0c7034178f9',
        //     'bd81f8a4ade6932536087767aec0511d',
        //   ],
        // };

        // const basicData = {
        //   projectId: 'd8064aa7-9643-44fb-bed9-1f23a690f968',
        //   site: '臺東處',
        //   subSite: 'NULL',
        //   species: '山羌',
        //   fromDateTime: '2018-01-01 00:00:00',
        //   toDateTime: '2018-03-31 23:59:59',
        //   effectiveTimeInterval: 60,
        //   fullCameraLocationMd5s: [
        //     'ba59a7c8d7474b301d44d0c7034178f9',
        //     'bd81f8a4ade6932536087767aec0511d',
        //   ],
        // };

        const res = await api({
          method: 'POST',
          url: `/media/annotation/${form.type.value}`,
          // url: '/media/annotation/daily-first-captured',
          // url: '/media/annotation/basic-calculation',
          data,
        });

        if (res.ret.status) {
          const checkStatus = async () => {
            const { data: status } = await axios({
              url: res.ret.status,
            });

            if (status === 'RUNNING') {
              setTimeout(checkStatus, 500);
            } else {
              const { data: csv } = await axios({
                url: res.ret.results,
              });

              resolve(csv);
              ctx.commit('CALC_FORM_SUCCESS', csv);
            }
          };
          checkStatus();
        } else {
          const rows = Object.values(res.ret.locationDailyFirstCaptured).reduce(
            (a, b) => a.concat(b),
            [],
          );

          let csv = '';
          if (rows[0]) {
            const heads = Object.keys(rows[0]);
            const values = rows.map(
              row => heads.map(head => row[head] || 'NULL').join`,`,
            );
            csv = `${heads}\n${values.join`\n`}`;
            resolve(csv);
            ctx.commit('CALC_FORM_SUCCESS', csv);
          }
        }
      });
    },
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
