import { projectExampleCsv } from '../../service/api';
import downloadCSV from '../../util/downloadCsv';

export const getters = {};

export const mutations = {};

export const actions = {
  async downloadProjectExampleCsv(_, payload) {
    const data = await projectExampleCsv(payload);
    const text = await data.text();
    downloadCSV(text.split('\n').map(v => v.split(',')));
  },
};

export default {
  namespaced: true,
  state: {
    uploadHistory: [],
  },
  getters,
  mutations,
  actions,
};
