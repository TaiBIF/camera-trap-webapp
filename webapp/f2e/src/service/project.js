const projects = [
  {
    id: 1,
    name: "林務局全島鼬獾監測",
    start_at: 2017,
    agency: '林務局',
    members: 17
  }
]


export function getProjects () {
  return new Promise((resolve, reject) => {
    try {
      resolve(projects)
    } catch(e) {
      reject(e)
    }
  })
}