const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getEntries = async () => {
  const res = await fetch(`${API_BASE}/api/journal`, {
    credentials: "include", // include cookies (auth)
  });
  if (!res.ok) throw new Error("Failed to fetch entries");
  return res.json();
};

export const addEntry = async (entry) => {
  const res = await fetch(`${API_BASE}/api/journal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error("Failed to add entry");
  return res.json();
};

export const deleteEntry = async (id) => {
  const res = await fetch(`${API_BASE}/api/journal/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete entry");
  try {
    return await res.json();
  } catch {
    return null;
  }
};


export const updateEntry = async (id, entry) => {
  const res = await fetch(`${API_BASE}/api/journal/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error("Failed to update entry");
  return res.json();
};
