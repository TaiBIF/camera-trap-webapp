const BASE_URL = 'https://camera-trap.tw/api/v0.8'

const fetchWrap = async ({ url, method, body }) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(body)
  })
  const data = await res.json()
  return data
}

export default fetchWrap
