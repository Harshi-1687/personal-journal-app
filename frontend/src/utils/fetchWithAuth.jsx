const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchWithAuth(url, options = {}, retry = true) {
  const merged = {
    credentials: "include", // send cookies (accessToken + refreshToken)
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  };

  const fullUrl = url.startsWith("http") ? url : `${API_BASE}${url}`;

  const res = await fetch(fullUrl, merged);
  if (res.status !== 401) return res; // all good, return response

  // if access token expired, try to refresh once
  if (retry) {
    const refreshRes = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      // retry the original request once after refresh
      return fetchWithAuth(url, options, false);
    }
  }

  // if still 401, user needs to log in again
  return res;
}
