import moment from 'moment';
import { getUploadHistory } from '../../service/api';

export const getters = {
  history: state =>
    state.uploadHistory.reduce(
      (result, v) => {
        const dayDiff = moment().diff(moment(v.modified * 1000), 'days');
        const data = {
          _id: v._id,
          createdAt: moment(v.modified * 1000).format('YYYY/MM/DD HH:mm:ss'),
          project: v.projectTitle,
          fileName: v.file,
          type: 'jpg',
          site: 'todo site',
          subsite: 'todo subsite',
          camera: 'todo camera',
          status: v.status,
          msg: 'todo error message',
        };

        if (dayDiff === 0) {
          result[0].list.push(data);
        } else if (dayDiff > 0 && dayDiff < 7) {
          result[1].list.push(data);
        } else {
          result[2].list.push(data);
        }

        return result;
      },
      [
        {
          name: '今天',
          list: [],
        },
        {
          name: '昨天',
          list: [],
        },
        {
          name: '7 天前',
          list: [],
        },
      ],
    ),
};

export const mutations = {
  updateUploadHistory(state, payload) {
    state.uploadHistory = payload;
  },
};

export const actions = {
  async getUploadHistory({ commit }) {
    const data = await getUploadHistory();
    commit('updateUploadHistory', data);
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
