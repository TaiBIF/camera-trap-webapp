import L from 'leaflet';
import {
  getProjects,
  createProject,
  editProject,
  getProject,
  getSpeciesGroup,
  getLocationIdentifiedStatus,
  getLocationRetrievedStatus,
  getLocationAbnormalStatus,
  updateAbnormalCamera,
  editCameraLocations,
  getColumnsField,
} from '../../service/api';

export const getters = {
  Projects: state => state.projects,
  currentProject: state =>
    state.projects.find(val => val._id === state.currentProjectId) || {
      adminArea: [],
      cameraLocations: [],
      dataFieldEnabled: [],
    },
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
          child:
            currentValue.children && currentValue.children[0].id !== 'NULL'
              ? currentValue.children.map(val => ({
                  value: val.id,
                  label: val.name,
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
  ProjectMarkers: (state, getters) => {
    // siteStatusTab, 0 = 影像回收狀況, 1 = 影像辨識進度
    return !getters.currentProject || !getters.currentProject.cameraLocations
      ? []
      : getters.currentProject.cameraLocations.reduce(
          (accumulator, currentValue) => {
            let siteIdx = null;
            if (accumulator.length) {
              accumulator.forEach((accu, i) => {
                if (accu.site === currentValue.site) {
                  siteIdx = i;
                }
              });
            }
            // locationIdentifiedStatus
            // locationCameraAbnormalStatus
            // locationRetrievedStatus
            // TODO: show only save original data, use computed to calculate in component
            if (siteIdx === null) {
              const retrievedStatus = Array(12).fill(0);
              const cameraAbnormalStatus = Array(12).fill(0);
              const identifiedStatus = Array(12).fill(0);

              state.locationRetrievedStatus.forEach(status => {
                if (status.site === currentValue.site) {
                  status.monthly_num.forEach(value => {
                    retrievedStatus[value.month - 1] += value.num;
                  });
                }
              });
              state.locationCameraAbnormalStatus.forEach(status => {
                if (status.site === currentValue.site) {
                  // AbnormalStatus have different response format, only record error month without error number
                  status.month.forEach(month_num => {
                    cameraAbnormalStatus[month_num - 1] = 1;
                  });
                }
              });
              state.locationIdentifiedStatus.forEach(status => {
                if (status.site === currentValue.site) {
                  status.monthly_num.forEach(value => {
                    identifiedStatus[value.month - 1] += value.num;
                  });
                }
              });
              accumulator.push({
                name: currentValue.site,
                ...currentValue,
                marker: L.latLng(
                  currentValue.wgs84dec_y,
                  currentValue.wgs84dec_x,
                ),
                identifiedStatus,
                cameraAbnormalStatus,
                retrievedStatus,
              });
            }

            return accumulator;
          },
          [],
        );
  },
  projectColumnsField: (state, getters) => {
    const projectColumns = getters.currentProject.dataFieldEnabled || [];
    return projectColumns
      .map(key => state.columnsField.find(obj => obj.key === key) || {})
      .filter(obj => obj.key);
  },
  projectDailyTestTime: (state, getters) => {
    return getters.currentProject.dailyTestTime || [];
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
  setCurrentProjectValue(state, payload) {
    const { key, value } = payload;
    const { projects } = state;
    state.projects = projects.map(val => {
      if (val._id === state.currentProjectId) {
        return {
          ...val,
          [key]: value,
        };
      }
      return val;
    });
  },
  setColumnsField(state, payload) {
    state.columnsField = payload;
  },
};

export const actions = {
  // 讀取計畫列表
  async loadProject({ commit }) {
    const data = await getProjects();
    commit('updateProjects', data);
  },
  // 讀取計畫
  async loadSingleProject({ commit }, projectId) {
    const data = await getProject(projectId);
    commit('updateProjects', [data]);
    commit('setCurrentProject', projectId);
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
      projectId: state.currentProjectId,
      ...payload,
    });
    commit('setLocationIdentifiedStatus', data);
  },
  // 影像回收狀況
  async getLocationRetrievedStatus({ state, commit }, payload) {
    const data = await getLocationRetrievedStatus({
      projectId: state.currentProjectId,
      ...payload,
    });
    commit('setLocationRetrievedStatus', data);
  },
  // 相機異常值
  async getLocationCameraAbnormalStatus({ state, commit }, payload) {
    const data = await getLocationAbnormalStatus({
      projectId: state.currentProjectId,
      ...payload,
    });
    commit('setLocationCameraAbnormalStatus', data);
  },
  // 回報相機異常
  async updateAbnormalCamera(_, payload) {
    await updateAbnormalCamera(payload);
  },
  // 3.1 編輯計畫基本資料
  async updateProject({ dispatch }, payload) {
    await editProject(payload);
    dispatch('loadProject');
  },
  // 3.2 計畫管理
  async loadColumnsField({ commit }) {
    const data = await getColumnsField();
    commit('setColumnsField', data);
  },
  // 3.4 計畫管理
  async updateCameraLocations(_, payload) {
    await editCameraLocations(payload);
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
    columnsField: [],
    // 畫面用
    siteStatusTab: 0,
  },
  getters,
  mutations,
  actions,
};
