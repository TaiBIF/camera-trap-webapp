import fetchWrap from '../../util/fetch'

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

const getProjects = async () => {
  const res = await fetchWrap({
    url: '/project/related-to-me',
    method: 'POST',
    body: { user_id: 'OrcID_0000-0002-7446-3249' }
  })

  return res.ref
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
