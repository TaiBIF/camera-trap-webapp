import moment from 'moment'

const downloadFile = (blob, filename) => {
  const aDOM = document.createElement('a')
  aDOM.href = window.URL.createObjectURL(blob)
  if (filename) aDOM.setAttribute('download', filename)
  aDOM.click()
}

export default (data) => {
  const csv = data.map(v => v.join(',')).join('\n')
  const csvBlob = new Blob([csv], { type: 'text/csv' })
  const filename = `CameraTrap-${moment().format('YYYYMMDD-HHmmss')}.csv`
  downloadFile(csvBlob, filename)
}
