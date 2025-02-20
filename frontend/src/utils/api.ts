import axios from "axios";

const url = process.env.NODE_ENV === "production" ? process.env.VITE_API_URL : "http://localhost:5000";

const API = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true,
});


export default API;