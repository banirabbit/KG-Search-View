import axios from "axios";

const request = axios.create({
  // baseURL: "http://localhost:5000",
  //baseURL: "http://192.168.1.104:32041",
  // baseURL: "http://192.168.1.117:25010",
  // baseURL: "http://127.0.0.1:8004",
  // baseURL: "http://127.0.0.1:8018",
  baseURL: "http://100.86.37.25:30096",
  // baseURL: "http://60.205.188.102:30096",
  timeout: 1000000,
});

export default request;
