import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;


const getToken = () => {
  const token = JSON.parse(localStorage.getItem("authToken"))?.access_token;
  return token ? `Bearer ${token}` : "";
};
console.log("import.meta.env:", import.meta.env);
console.log(API_BASE_URL)
const ApiBase = axios.create({
  baseURL: API_BASE_URL,
});

ApiBase.interceptors.request.use((config) => {
  config.headers.Authorization = getToken();
  return config;
});



export const get = (url, params = {}, headers = {}) =>
  ApiBase.get(url, { params, headers });

export const post = (url, data, headers = {}) =>
  ApiBase.post(url, data, { headers });
export const put = (url, data) => ApiBase.put(url, data);
export const del = (url, params = {}) => ApiBase.delete(url, { params });
export const patch = (url, data = {}, query = {}, headers = {}) =>
  ApiBase.patch(url, data, {
    params: query,
    headers,
  });
