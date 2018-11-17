import { getSiteData, getDataFields, updateAnnotation } from '../../service/api'

export const getters = {
  species: state => state.dataFields.speciesList,
  siteData: state => {
    const defaultColumn = {
      fullSite: {
        data: 'fullSite',
        label: '樣區',
        editorMode: false
      },
      cameraLocation: {
        data: 'cameraLocation',
        label: '相機位置',
        editorMode: false
      },
      fileName: {
        data: 'fileName',
        label: '檔名',
        editorMode: false
      },
      corrected_date_time: {
        data: 'corrected_date_time',
        label: '時間',
        editorMode: false
      },
      species: {
        data: 'species',
        label: '物種',
        editorMode: 'text'
      }
    }

    // 組合 column header
    const column = state.dataFields.fieldDetails.reduce((obj, val) => {
      obj[val.key] = {
        data: val.key,
        label: val.label,
        editorMode: val.widget_type,
        selectOptions: val.widget_select_options
      }
      return obj
    }, defaultColumn)

    // 拆解實際顯示資料
    const data = state.siteData.reduce((obj, val) => {
      val.tokens.map((token, tokenIdx) => {
        const ret = {
          fullSite: (val.subSite) ? `${val.site}-${val.subSite}` : `${val.site}`,
          cameraLocation: val.cameraLocation,
          fileName: val.url.split('/').pop(),
          corrected_date_time: val.corrected_date_time,
          imageUrl: val.url,
          projectTitle: val.projectTitle,
          fullCameraLocationMd5: val.fullCameraLocationMd5,
          _id: val._id,
          // 編輯封包需要使用，因為打散後就不知道原本資料的編號
          index: {
            token: tokenIdx,
            column: {}
          }
        }
        token.data.map((d, columnIdx) => {
          ret[d.key] = d.value
          ret.index.column[d.key] = columnIdx
        })
        obj.push(ret)
      })
      return obj
    }, [])

    return {
      data,
      colHeaders: Object.values(column).map(v => v.label),
      columns: Object.values(column)
    }
  }
}

export const mutations = {
  updateDataFields (state, payload) {
    state.dataFields = payload
  },
  updateSiteData (state, payload) {
    state.siteData = payload
  }
}

export const actions = {
  async getSiteData ({ commit }, payload) {
    const dataFields = await getDataFields({ projectTitle: payload.query.projectTitle })
    commit('updateDataFields', dataFields)
    const data = await getSiteData(payload)
    commit('updateSiteData', data)
  },
  async updateAnnotation (_, payload) {
    await updateAnnotation(payload)
  }
}

export default {
  namespaced: true,
  state: {
    dataFields: { fieldDetails: [] },
    siteData: []
  },
  getters,
  mutations,
  actions
}
