import * as api from '../service/api'
import * as types from './mutation-types'


export const getProject = ({ commit }) => {
  api.getProjects().then(projects => { 
    commit(types.SET_PROJECT, { projects })
  })
}

export const setFileType = ({ commit }, type) => {
  commit(types.SET_FILETYPE, type)
}
export const setFiles = ({ commit }, files) => {
  commit(types.SET_FILES, files)
}

export const setCurrentProject = ({ commit }, index) => {
  commit(types.SET_CURRENTPROJECT, index)
}
export const setCurrentSite = ({ commit }, site) => {
  commit(types.SET_CURRENTSITE, site)
}

export const setCurrentRow = ({ commit }, index) => {
  commit(types.SET_CURRENTROW, index)
}

export const setCurrentColumn = ({ commit }, column) => {
  commit(types.SET_CURRENTCOLUMN, column)
}

export const setSpecies = ({ commit }, species) => {
  commit(types.SET_SPECIES, species)
}

export const setCamara = ({ commit }, camara) => {
  commit(types.SET_CAMARA, camara)
}

export const setTableRows = ({ commit }, rows) => {
  commit(types.SET_TABLEROWS, rows)
}
export const setTableRow = ({ commit }, row, idx) => {
  commit(types.SET_TABLEROW, row, idx)
}