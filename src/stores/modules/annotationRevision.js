import moment from 'moment';
import { getRevision, restoreRevision } from '../../service/api';

export const getters = {};

export const mutations = {
  updateRevision(state, payload) {
    state.revision = payload;
  },
};

export const actions = {
  async getRevision({ commit }, payload) {
    const data = await getRevision(payload);
    commit(
      'updateRevision',
      data.revisions.map(v => ({
        ...v,
        created: moment(v.created * 1000).format('YYYY/MM/DD HH:mm:ss'), // 轉換顯示時間格式
        url_md5: data.url_md5, // 保存恢復時所需的 id
      })),
    );
  },
  async restoreRevision({ dispatch }, payload) {
    await restoreRevision(payload);
    dispatch('getRevision', { _id: payload.url_md5 });
  },
};

export default {
  namespaced: true,
  state: {
    revision: [],
  },
  getters,
  mutations,
  actions,
};
