import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:80",
  timeout: 50000,
  headers: {
    "Content-type": "application/json"
  }
});