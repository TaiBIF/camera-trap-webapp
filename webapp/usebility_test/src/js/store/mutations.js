import * as types from './mutation-types'

export default {
  [types.SET_FILES](state, {files}) {
    state.files = {files}
  },
  [types.SET_FILETYPE](state, type) {
    state.fileType = type
  },
  [types.SET_PROJECT](state, {projects}) {
    state.projects = projects
  },
  [types.SET_CURRENTPROJECT](state, index) {
    state.currentProject = index
  },
  [types.SET_CURRENTSITE](state, site) {
    state.currentSite = site
  },
  [types.SET_CURRENTROW](state, index) {
    state.currentRow = index
  },
  [types.SET_CURRENTROW](state, index) {
    state.currentRow = index
  },
  [types.SET_CURRENTCOLUMN](state, column) {
    state.currentColumn = column
  },
  [types.SET_SPECIES](state, species) {
    state.species = species
  },
  [types.SET_CAMARA](state, camara) {
    state.camara = camara
  },
  [types.SET_TABLEROWS](state, table_rows) {
    state.table_rows = table_rows
  },
  [types.SET_TABLEROW](state, row, idx) {
    state.table_rows[idx] = row
  },
}

// export const SET_CURRENTROW = 'SET_CURRENTROW'
// export const SET_CURRENTCOLUMN = 'SET_CURRENTCOLUMN'
// export const SET_CAMARA = 'SET_CAMARA'
// export const SET_SPECIES = 'SET_SPECIES'
// export const SET_TABLEROWS = 'SET_TABLEROWS'
