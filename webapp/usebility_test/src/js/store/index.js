import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  projects: [],
  fileType: '',
  files: [],
  currentProject: 1,
  currentSite: null,
  camara: ['HC20A','HC20B','HC20C','PT01A','PT02A','PT03A','PT04A','PT05A','PT06A','PT07A','PT08A','PT09A','PT020A','PT21A','PT22A','PT23A','PT24A'],
  currentRow: 0,
  currentColumn: 'species',
  species: ['測試', '水鹿', '鼬獾', '鳥', '空拍', '山羌', '松鼠', '白鼻心', '獼猴', '食蟹獴', '野豬', '穿山甲', '台灣獼猴', '赤腹松鼠', '人','山豬'],
  table_rows: []
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})