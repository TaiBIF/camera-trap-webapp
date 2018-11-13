import L from 'leaflet';
import {
  getProjects,
  createProject,
  getSpeciesGroup,
  getLocationIdentifiedStatus,
  getLocationRetrievedStatus,
  getLocationAbnormalStatus,
} from '../../service/api';

export const getters = {
  Projects: state => state.projects,
  currentProject: state =>
    state.projects.find(val => val.projectTitle === state.currentProjectId),
  cameraLocations: (_, getters) => {
    if (!getters.currentProject || !getters.currentProject.cameraLocations) {
      return [];
    }

    const locations = getters.currentProject.cameraLocations.map(
      ({ site, subSite }) => ({ site, subSite }),
    );

    const table = locations.reduce((accumulator, currentValue) => {
      // site 不存在
      if (!accumulator[currentValue.site]) {
        accumulator[currentValue.site] = {
          id: currentValue.site,
          name: currentValue.site,
          children: [],
        };
      }
      // 判斷 subSite 是否存在
      if (
        !accumulator[currentValue.site].children.find(
          val => val.name === currentValue.subSite,
        )
      ) {
        accumulator[currentValue.site].children.push({
          id: currentValue.subSite,
          name: currentValue.subSite,
        });
      }

      return accumulator;
    }, {});

    return Object.values(table);
  },
  species: state => {
    const data = state.speciesGroup.species_group.map(val => [
      val.species,
      val.count,
    ]);
    data.sort((a, b) => b[1] - a[1]);

    return data.map(val => ({ name: val[0], y: val[1] }));
  },
  // vue-select 使用的樣站資訊
  sites: (_, getters) => {
    // 格式同 cameraLocations 只是要替換 key， id -> value, name -> label
    const sites = getters.cameraLocations.reduce(
      (accumulator, currentValue) => {
        const tmp = {
          value: currentValue.id,
          label: currentValue.name,
          camera: 
            getters.currentProject.cameraLocations.reduce(
              (array, camera) => {
                if (
                  currentValue.id === camera.site &&
                    'NULL' === camera.subSite
                ) {
                  array.push(camera);
                }
                return array;
              },
              [],
            ),
          child:
            currentValue.children && currentValue.children[0].id !== 'NULL'
              ? currentValue.children.map(val => ({
                value: val.id,
                label: val.name,
                // 塞入 camera 資料
                camera: getters.currentProject.cameraLocations.reduce(
                  (array, camera) => {
                    if (
                      currentValue.id === camera.site &&
                        val.id === camera.subSite
                    ) {
                      array.push(camera);
                    }
                    return array;
                  },
                  [],
                ),
              }))
              : [],
        };
        accumulator.push(tmp);

        return accumulator;
      },
      [],
    );

    return [
      {
        value: '全部樣區',
        label: '全部樣區',
      },
      ...sites,
    ];
  },
  ProjectMarkers: state => {
    // siteStatusTab, 0 = 影像回收狀況, 1 = 影像辨識進度
    const source =
      state.siteStatusTab === 0
        ? state.locationRetrievedStatus
        : state.locationIdentifiedStatus;

    return source.reduce((accumulator, currentValue) => {
      let siteIdx= null;
      if(accumulator.length) {
        accumulator.forEach((accu, i) => {
          if (accu.name === currentValue.site) {
            siteIdx = i
          }
        });
      }
      
      if (siteIdx === null) {
        accumulator.push({
          id: currentValue._id,
          name: currentValue.site,
          projectId: currentValue.projectTitle,
          wgs84dec_y: currentValue.wgs84dec_y, 
          wgs84dec_x: currentValue.wgs84dec_x,
          marker: L.latLng(currentValue.wgs84dec_y, currentValue.wgs84dec_x),
          progress: currentValue.monthly_num.reduce((progress, currentValue) => {
            progress[currentValue.month] = currentValue.num;
            return progress;
          }, Array(12).fill(0)),
        })
      } else {
        accumulator[siteIdx].progress = currentValue.monthly_num.reduce((progress, value) => {
          progress[value.month] += value.num;
          return progress;
        }, accumulator[siteIdx].progress)
      }
      return accumulator;
    }, []);
  },
  SiteMarkers: state => {
    const source =
      state.siteStatusTab === 0
        ? state.locationRetrievedStatus
        : state.locationIdentifiedStatus;
    
    return source.map(val => ({
      id: val._id,
      name: val.cameraLocation,
      site: val.site,
      subSite: val.subSite,
      projectId: val.projectTitle,
      wgs84dec_y: val.wgs84dec_y, 
      wgs84dec_x: val.wgs84dec_x,
      marker: L.latLng(val.wgs84dec_y, val.wgs84dec_x),
      progress: val.monthly_num.reduce((accumulator, currentValue) => {
        accumulator[currentValue.month] = currentValue.num;
        return accumulator;
      }, Array(12).fill(0)),
    }));
  },
};

export const mutations = {
  updateProjects(state, payload) {
    state.projects = payload;
  },
  setCurrentProject(state, payload) {
    state.currentProjectId = payload;
  },
  setSpeciesGroup(state, payload) {
    state.speciesGroup = payload;
  },
  setLocationIdentifiedStatus(state, payload) {
    state.locationIdentifiedStatus = payload;
  },
  setLocationRetrievedStatus(state, payload) {
    state.locationRetrievedStatus = payload;
  },
  setLocationCameraAbnormalStatus(state, payload) {
    state.locationCameraAbnormalStatus = payload;
  },
  setSiteStatusTab(state, payload) {
    state.siteStatusTab = payload;
  },
};

export const actions = {
  // 讀取計畫列表
  async loadProject({ commit }) {
    const data = await getProjects();
    commit('updateProjects', data);
  },
  // 新增計畫
  async createProject({ dispatch }, payload) {
    await createProject(payload);
    dispatch('loadProject');
  },
  // 取得辨識物種列表
  async getSpeciesGroup({ state, commit }) {
    const data = await getSpeciesGroup(state.currentProjectId);
    commit('setSpeciesGroup', data);
  },
  // 影像辨識狀況
  async getLocationIdentifiedStatus({ state, commit }, payload) {
    const data = await getLocationIdentifiedStatus({
      projectTitle: state.currentProjectId,
      ...payload,
    });
    console.log('getLocationIdentifiedStatus', data);
    commit('setLocationIdentifiedStatus', data);
  },
  // 影像回收狀況
  async getLocationRetrievedStatus({ state, commit }, payload) {
    const data = await getLocationRetrievedStatus({
      projectTitle: state.currentProjectId,
      ...payload,
    });
    console.log('getLocationRetrievedStatus', data);
    commit('setLocationRetrievedStatus', data);
  },
  // 相機異常值
  async getLocationCameraAbnormalStatus({ state, commit }, payload) {
    const data = await getLocationAbnormalStatus({
      projectTitle: state.currentProjectId,
      ...payload,
    });
    console.log('getLocationCameraAbnormalStatus', data);
    commit('setLocationCameraAbnormalStatus', data);
  },
};

export default {
  namespaced: true,
  state: {
    projects: [],
    currentProjectId: null,
    speciesGroup: {
      species_group: [],
      total: 0,
      modified: null,
    },
    locationIdentifiedStatus: [],
    locationRetrievedStatus: [],
    locationCameraAbnormalStatus: [],
    // 畫面用
    siteStatusTab: 0,
  },
  getters,
  mutations,
  actions,
};
