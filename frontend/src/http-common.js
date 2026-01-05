import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:80",
  timeout: 50000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 memória token (nem localStorage!)
let accessToken = null;

// App.jsx fogja hívni
export const setAccessToken = (token) => {
  accessToken = token;
};

// 🔹 REQUEST interceptor – token hozzáadása
http.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 RESPONSE interceptor – token frissítés 401 esetén
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          "http://localhost:80/auto/refresh",
          {},
          { withCredentials: true }
        );

        if (refreshResponse.data?.accessToken) {
          accessToken = refreshResponse.data.accessToken;
          originalRequest.headers.Authorization =
            `Bearer ${accessToken}`;

          return http(originalRequest); // 🔁 újrapróbálás
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default http;
