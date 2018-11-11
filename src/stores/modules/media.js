import { getSiteData } from '../../service/api'

export const getters = {
  siteData: state => {
    return [
      'URL,Project,Station,Camera,FileName,DateTime,Species,Sex,Age,ID,IdvCount,Category,SciName,Behavior',
      ...state.siteData.map(val => {
        // 順序對照 index 0 的設定
        return [
          val.url, // 圖片網址
          val.projectTitle, // 計畫名稱
          val.subSite, // 子樣區
          val.cameraLocation, // 相機編號
          val.url.split('/').pop(), // 圖片檔名
          val.corrected_date_time, // 日期
          val.tokens[0].data[0].value, // Species
          val.tokens[0].data[1].value, // Sex
          val.tokens[0].data[2].value, // Age
          'ID 無資料', // ID
          'IdvCount 無資料', // IdvCount
          'Category 無資料', // Category
          'SciName 無資料', // SciName
          'Behavior 無資料' // Behavior
        ].join(',')
      })
    ]
  }
}

export const mutations = {
  updateSiteData (state, payload) {
    state.siteData = payload
  }
}

export const actions = {
  async getSiteData ({ commit }, payload) {
    const data = await getSiteData(payload)
    commit('updateSiteData', data)
  }
}

export default {
  namespaced: true,
  state: {
    siteData: []
  },
  getters,
  mutations,
  actions
}
