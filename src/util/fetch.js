const fetchWrap = async ({ url, method, body }) => {
  const res = await fetch(`${process.env.VUE_APP_API_URL}${url}`, {
    method,
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return data;
};

export default fetchWrap;
