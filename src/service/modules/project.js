import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://camera-trap.tw/api/v0.8/',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }
})

const fake = {
  projects: [
    {
      id: 1,
      name: '林務局全島鼬獾監測',
      start_at: 2017,
      agency: '林務局',
      members: 17
    }
  ]
}

const getProjects = () => {
  // axiosInstance
  axios
    .post('https://camera-trap.tw/api/v0.8/project/related-to-me', null, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    })
    .then(function (response) {
      console.log(response)
    })
    .catch(function (error) {
      console.log(error)
    })
  return new Promise(resolve => resolve(fake.projects))
}

const delay = () =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve()
    }, 2000)
  )

const createProject = async payload => {
  await delay(1000)
  fake.projects.push(payload)
}

export { getProjects, createProject }
