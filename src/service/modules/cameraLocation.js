import fetchWrap from '../../util/fetch'

const getCameraLocked = async payload => {
  const res = await fetchWrap({
    url: '/camera-location/data-lock/locked',
    method: 'POST',
    body: payload
  })

  return res.ret.map(val => val.cameraLocationDataLock)
}

export { getCameraLocked }
