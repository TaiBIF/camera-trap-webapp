import {
  getSiteData,
  getDataFields,
  updateAnnotation,
  replicateToken,
  deleteToken,
} from '../../service/api';

const formatSiteData = state => {
  const defaultColumn = {
    fullSite: {
      data: 'fullSite',
      label: '樣區',
      editorMode: false,
      readOnly: true,
    },
    cameraLocation: {
      data: 'cameraLocation',
      label: '相機位置',
      editorMode: false,
      readOnly: true,
    },
    fileName: {
      data: 'fileName',
      label: '檔名',
      editorMode: false,
      readOnly: true,
    },
    corrected_date_time: {
      data: 'corrected_date_time',
      label: '時間',
      editorMode: false,
      readOnly: true,
    },
    species: {
      data: 'species',
      label: '物種',
      type: 'dropdown',
      source: state.dataFields.speciesList,
    },
  };

  // 組合 column header
  const column = state.dataFields.fieldDetails.reduce((obj, val) => {
    obj[val.key] = {
      data: val.key,
      label: val.label,
      type: val.widget_type == 'select' ? 'dropdown' : 'handsontable',
      source: val.widget_select_options,
    };
    return obj;
  }, defaultColumn);

  // 拆解實際顯示資料
  const data = state.rawSiteData.reduce((obj, val) => {
    val.tokens.map((token, tokenIdx) => {
      const ret = {
        fullSite: val.subSite ? `${val.site}-${val.subSite}` : `${val.site}`,
        site: val.site,
        subSite: val.subSite,
        cameraLocation: val.cameraLocation,
        fileName: val.uploaded_file_name,
        corrected_date_time: val.corrected_date_time,
        type: val.type,
        hasImage: !!val.low_quality_url,
        ...(val.type === 'MovingImage'
          ? {
              youtubeUrl: val.youtube_url,
            }
          : {
              imageUrl: `${val.imageUrlPrefix}${val.url}`,
              lowQualityImageUrl: `${val.imageUrlPrefix}${val.low_quality_url}`,
            }),
        projectTitle: val.projectTitle,
        projectId: val.projectId,
        fullCameraLocationMd5: val.fullCameraLocationMd5,
        _id: val._id,
        // 編輯封包需要使用，因為打散後就不知道原本資料的編號
        index: {
          token: tokenIdx,
          column: {},
          columnLength: token.data.length, // 新增資料要補在最後面
        },
        tokenErrorFlag: token.token_error_flag,
        species_shortcut: token.species_shortcut,
      };
      token.data.map((d, columnIdx) => {
        ret[d.key] = d.value;
        ret.index.column[d.key] = columnIdx;
      });
      obj.push(ret);
    });
    return obj;
  }, []);

  return {
    data,
    colHeaders: Object.values(column).map(v => v.label),
    columns: Object.values(column),
  };
};

export const getters = {
  species: state => state.dataFields.speciesList,
};

export const mutations = {
  updateDataFields(state, payload) {
    state.dataFields = payload;
  },
  updateSiteData(state, payload) {
    state.rawSiteData = payload;
    state.siteData = formatSiteData(state);
  },
  updateQuery(state, payload) {
    state.query = payload;
  },
  // 當資料要新增時需要更新指定 data 的 index 屬性
  addSiteDataLength(state, { row, newColumnIndex, prop }) {
    state.siteData.data[row].index.columnLength = newColumnIndex + 1;
    state.siteData.data[row].index.column[prop] = newColumnIndex;
  },
};

export const actions = {
  updateQuery({ commit }, payload = {}) {
    payload.projection = {
      projectId: true,
      projectTitle: true,
      site: true,
      subSite: true,
      cameraLocation: true,
      fullCameraLocationMd5: true,
      'tokens.data.key': true,
      'tokens.data.label': true,
      'tokens.data.value': true,
      corrected_date_time: true,
      date_time_corrected_timestamp: true,
      url: true,
      low_quality_url: true,
      imageUrlPrefix: true,
      uploaded_file_name: true,
      type: true,
      youtube_url: true,
    };
    payload.sort = [
      ['cameraLocation', 1],
      ['date_time_corrected_timestamp', 1],
      ['uploaded_file_name', 1],
    ];
    commit('updateQuery', payload);
  },
  async getSiteData({ commit }, payload) {
    const dataFields = await getDataFields({
      projectId: payload.query.projectId,
    });
    commit('updateDataFields', dataFields ? dataFields : { fieldDetails: [] });
    const data = await getSiteData(payload);
    commit('updateSiteData', data);
  },
  async updateAnnotation(_, payload) {
    await updateAnnotation(payload);
  },
  async replicateToken(_, payload) {
    await replicateToken(payload);
  },
  async deleteToken(_, payload) {
    await deleteToken(payload);
  },
};

export default {
  namespaced: true,
  state: {
    dataFields: { fieldDetails: [] },
    rawSiteData: [],
    siteData: { data: [] },
  },
  getters,
  mutations,
  actions,
};
