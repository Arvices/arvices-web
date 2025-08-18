import axios from "axios";

const api = axios.create({
  baseURL: "https://arvicesapi.denateonlineservice.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically before every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token"); // 👈 ensure this key matches your login storage
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("🔑 Attached token to request:", token); // debug log
  } else {
    console.warn("⚠️ No access_token found in localStorage");
  }
  return config;
});

export default api;
