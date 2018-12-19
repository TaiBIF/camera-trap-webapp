import axios from 'axios';
const { VUE_APP_API_URL } = process.env;

const api = axios.create({
  baseURL: VUE_APP_API_URL,
});

api.interceptors.response.use(({ data }) => data);

export default api;
