import { getSiteData } from '../../service/api'

export const getters = {
  siteData: state => {
    const defaultColumn = {
      subSite: '樣區',
      cameraLocation: '相機位置',
      fileName: '檔名',
      corrected_date_time: '時間'
    }

    // 組合 column header
    const column = state.siteData.reduce((obj, val) => {
      val.tokens.map(token => {
        token.data.map(d => {
          obj[d.key] = d.label !== '' ? d.label : obj[d.key]
        })
      })
      return obj
    }, defaultColumn)

    // 拆解實際顯示資料
    const data = state.siteData.reduce((obj, val) => {
      val.tokens.map(token => {
        const ret = {
          subSite: val.subSite,
          cameraLocation: val.cameraLocation,
          fileName: val.url.split('/').pop(),
          corrected_date_time: val.corrected_date_time,
          imageUrl: val.url,
          projectTitle: val.projectTitle,
          fullCameraLocationMd5: val.fullCameraLocationMd5,
          _id: val._id
        }
        token.data.map(d => {
          ret[d.key] = d.value
        })
        obj.push(ret)
      })
      return obj
    }, [])

    return {
      data: data,
      colHeaders: Object.values(column),
      columns: Object.keys(column).map(val => ({ data: val }))
    }
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
