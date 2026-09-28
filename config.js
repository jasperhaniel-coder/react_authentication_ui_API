// Central place for environment-based settings. Written to call `${API_BASE_URL}/...`.

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://task-79s6.onrender.com";
