// Use the variable from Docker, or fallback to local if running npm run dev
const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export async function searchMedicine(name) {
  const res = await fetch(`${BASE_URL}/search?name=${name}`);
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
}