import axios from "axios";

const api = axios.create({
  baseURL: "https://arvicesapi.denateonlineservice.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("🔑 Attached token to request:", token); // debug log
  } else {
    console.warn("⚠️ No access_token found in localStorage");
  }
  return config;
});

export default api;

// --- Showcase API ---
export interface ShowcaseItem {
  id: number;
  title: string;
  description: string;
  createdDate: string;
}

export async function getShowcase(page: number, limit = 10) {
  try {
    const res = await api.get("/showcase/getallshowcase", {
      params: { orderBy: "DESC", page, limit },
    });

    const mapped: ShowcaseItem[] = (res.data.response || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      createdDate: item.createdDate,
    }));

    return { items: mapped, total: res.data.total || 0 };
  } catch (err) {
    console.error("❌ Failed to fetch showcase", err);
    throw err;
  }
}
