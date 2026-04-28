import axios from "axios";

const API = "http://localhost:3000/api";

const publicAPI = axios.create({
  baseURL: API,
});

export default publicAPI;
