import axios from "axios";

const url = import.meta.env.VITE_API_BASE_URL

const API = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true,
});


export default API;