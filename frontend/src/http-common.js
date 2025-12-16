import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:80",
  timeout: 50000,
  withCredentials: true,
  headers: {
    "Content-type": "application/json"
  }
});