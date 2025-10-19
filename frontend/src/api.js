const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export async function getCourierLocation(courierId) {
  const res = await fetch(`${API_URL}/couriers/${courierId}/location`);
  return await res.json();
}