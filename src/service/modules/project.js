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
  // axios
  //   .post('https://camera-trap.tw/api/v0.8/project/related-to-me', null, {
  //     'Access-Control-Allow-Origin': '*',
  //     'Content-Type': 'application/json'
  //   })
  //   .then(function (response) {
  //     console.log(response)
  //   })
  //   .catch(function (error) {
  //     console.log(error)
  //   })

  fetch(`https://camera-trap.tw/api/project/related-to-me`, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer' // no-referrer, *client
    // body: JSON.stringify({
    //   idToken: awsCognitoSession.getIdToken().getJwtToken()
    // }) // body data type must match "Content-Type" header
  })
    .then(res => res.json())
    .then(response => {
      console.log(`related-to-me: ${JSON.stringify(response)}`)
    }) // parses response to JSON

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
