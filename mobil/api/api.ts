import axios from "axios";

let accessToken = null;
let backendCim = "http://10.210.71.23:80";

// ------------------- Axios instance -------------------
const api = axios.create({
  baseURL: backendCim,
  withCredentials: true,
  timeout: 5000,
});

// ------------------- Access token -------------------
export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

// ------------------- Backend cím -------------------
export function setBackendCim(cim) {
  backendCim = cim;
  api.defaults.baseURL = cim; // <<< EZ A LÉNYEG
}

export function getBackendCim() {
  return backendCim;
}

// ------------------- Request interceptor -------------------
api.interceptors.request.use(
  async (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------- Response interceptor -------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint =
      originalRequest.url.includes("/auto/login") ||
      originalRequest.url.includes("/auto/refresh") ||
      originalRequest.url.includes("/auto/logout");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        await refreshToken();
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// ------------------- Refresh token -------------------
async function refreshToken() {
  try {
    const response = await api.post("/auto/refresh", {}, { withCredentials: true });

    accessToken = response.data.accessToken;
    console.log("Access token frissítve:", accessToken);

    return accessToken;
  } catch (err) {
    console.error("Refresh token hiba:", err.response?.data || err.message);

    await api.post("/auto/logout", {}, { withCredentials: true });

    accessToken = null;
    throw err;
  }
}

export { api };