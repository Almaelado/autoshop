import axios from "axios";

// A webes kliens minden API kereset ezen az axios peldanyon keresztul kuld.
export default axios.create({
  baseURL: "http://localhost:80/",
  withCredentials: true,
});
