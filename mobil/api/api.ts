import axios from "axios";

let accessToken = null;
let backendCim = "http://10.210.71.23:80";

// Az osszes mobil API keres ugyanazt a baseURL-t es auth logikat hasznalja.
const api = axios.create({
  baseURL: backendCim,
  withCredentials: true,
  timeout: 5000,
});

// A token memoriaban van tarolva, es minden kereshez automatikusan bekerul.
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

// A request interceptor minden kereshez hozzafuzi az access tokent, ha van.
api.interceptors.request.use(
  async (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 401 eseten egyszer megprobalunk refresh-elni, aztan ujrakuldjuk az eredeti kerest.
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

// A refresh cookie-bol uj access token keszul, ha a session meg ervenyes.
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
