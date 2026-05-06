/**
 * Search Service
 * Responsible for orchestrating:
 * - Inventory Service (critical)
 * - Analytics Service (non-blocking)
 * - Recommendation Service (optional)
 */

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

/**
 * Service configuration
 */
const SERVICES = {
  inventory: "http://inventory-service:5001",
  analytics: "http://analytics-service:5002",
  recommendation: "http://recommendation-service:5003"
};

/**
 * Axios instance (centralized config)
 */
const http = axios.create({
  timeout: 5000
});

function normalizeMedicine(medicines, inputName) {
  if (!medicines || medicines.length === 0) {
    return inputName.charAt(0).toUpperCase() + inputName.slice(1);
  }
  return medicines[0].name;
}

/**
 * Utility: fetch inventory (critical)
 */
async function fetchInventory(name) {
  const response = await http.get(`${SERVICES.inventory}/medicines`, {
    params: { name }
  });
  return response.data; // This now contains pharmacyDetails per medicine
}

/**
 * NEW Utility: fetch global pharmacy count
 */
async function fetchTotalPharmacyCount() {
  try {
    const response = await http.get(`${SERVICES.inventory}/pharmacy-count`);
    return response.data.count || 0;
  } catch (err) {
    console.error("Pharmacy count error:", err.message);
    return 0;
  }
}

/**
 * Utility: log analytics (non-blocking)
 */
function logSearch(name) {
  http.post(`${SERVICES.analytics}/log`, { name })
    .catch(err => console.error("Analytics error:", err.message));
}

/**
 * Utility: fetch recommendations (safe)
 */
async function fetchRecommendations(name, medicines) {
  try {
    const response = await http.post(
      `${SERVICES.recommendation}/recommend`,
      { name, results: medicines }
    );

    // ✅ FIX: match actual response shape
    return response.data.ai_recommendations || [];

  } catch (err) {
    console.error("Recommendation error:", err.message);
    return [];
  }
}

/**
 * Utility: fetch trending data (safe)
 */
async function fetchTrending() {
  try {
    const response = await http.get(`${SERVICES.analytics}/trending`);
    return response.data || [];
  } catch (err) {
    console.error("Trending error:", err.message);
    return [];
  }
}

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.send("Search Service is running");
});

/**
 * GET /search?name=<medicine>
 */
app.get("/search", async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({
      error: "Query parameter 'name' is required"
    });
  }

  try {
    // 1. Inventory
    const medicines = await fetchInventory(name);

    const canonicalName = normalizeMedicine(medicines, name);

    // 2. Analytics (fire and forget)
    logSearch(canonicalName);

    // 3. Parallel safe calls (no conditions)
    const [recommendations, trending, totalPharmacies] = await Promise.all([
      fetchRecommendations(canonicalName, medicines),
      fetchTrending(),
      fetchTotalPharmacyCount()
    ]);

    // 4. RESPONSE (always include AI)
    res.json({
      query: name,
      totalResults: medicines.length,
      totalPharmacies,
      results: medicines,
      recommendations,
      trending
    });

  } catch (error) {
    console.error("Critical service error:", error.message);
    res.status(500).json({
      error: "Search service partially unavailable"
    });
  }
});
/**
 * Start server
 */
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Search Service listening on port ${PORT}`);
});