const fetchWrap = async ({ url, method, body }) => {
  const res = await fetch(`${process.env.VUE_APP_API_URL}${url}`, {
    method,
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json; charset=utf-8',
      'camera-trap-user-id': localStorage.getItem('userId'),
      'camera-trap-user-id-token': localStorage.getItem('awsIdToken'),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data;
};

export default fetchWrap;
