import axios from "axios";

/** Initialize Axios */
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
});

/** Inceptors Request */
http.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Handlers 401 */
http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status == 401) {
      console.log(error);
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default http;
