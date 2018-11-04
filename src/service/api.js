const message = {
  id: 1,
  title: '緊急通知：2018/12/25 下午10點緊急維修，系統暫停使用'
}

export function getMessage () {
  return new Promise((resolve, reject) => {
    try {
      resolve(message)
    } catch (e) {
      reject(e)
    }
  })
}

const projects = [
  {
    id: 1,
    name: '林務局全島鼬獾監測',
    start_at: 2017,
    agency: '林務局',
    members: 17
  }
]

export function getProjects () {
  return new Promise((resolve, reject) => {
    try {
      resolve(projects)
    } catch (e) {
      reject(e)
    }
  })
}
