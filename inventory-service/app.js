const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5001;

app.use(express.json());
app.use(cors());

/**
 * Helper: Reads the updated data.json structure
 * Structure expected: { "pharmacies": [...], "medicines": [...] }
 */

// FIX 1: validate env BEFORE axios is created
const CLOUDANT_URL = (process.env.CLOUDANT_URL || "").trim();
const CLOUDANT_USERNAME = process.env.CLOUDANT_USERNAME;
const CLOUDANT_PASSWORD = process.env.CLOUDANT_PASSWORD;

if (!CLOUDANT_URL) {
  throw new Error("CLOUDANT_URL is missing or undefined");
}

const DB_MEDICINES = "medicines";
const DB_PHARMACIES = "pharmacies";

// FIX 2: ensure correct axios config for Cloudant
const cloudant = axios.create({
  baseURL: CLOUDANT_URL,
  auth: {
    username: CLOUDANT_USERNAME,
    password: CLOUDANT_PASSWORD
  },
  headers: {
    "Content-Type": "application/json"
  }
});

/**
 * Helper: Reads data from Cloudant instead of disk
 */
const getInventoryFromDisk = async () => {
  try {
    const [medRes, pharmRes] = await Promise.all([
      cloudant.post(`/${DB_MEDICINES}/_find`, { selector: {} }),
      cloudant.post(`/${DB_PHARMACIES}/_find`, { selector: {} })
    ]);

    return {
      medicines: medRes.data.docs || [],
      pharmacies: pharmRes.data.docs || []
    };
  } catch (error) {
    console.error("Error reading from Cloudant:", error.message);
    return { pharmacies: [], medicines: [] };
  }
};

/**
 * GET /pharmacy-count
 * Returns the total number of connected pharmacies
 */
app.get("/pharmacy-count", async (req, res) => {
  const { pharmacies } = await getInventoryFromDisk();
  res.json({ count: pharmacies.length });
});

/**
 * GET /medicines?name=<query>
 * Searches by name and compound, and attaches pharmacy details
 */
app.get("/medicines", async (req, res) => {
  const { name } = req.query;
  const { medicines, pharmacies } = await getInventoryFromDisk();

  if (!name) {
    return res.json(medicines);
  }

  const query = name.toLowerCase();

  const filtered = medicines.filter(m =>
    m.name?.toLowerCase().includes(query) ||
    m.compound?.toLowerCase().includes(query) ||
    (m.saltSynonyms && m.saltSynonyms.toLowerCase().includes(query))
  );

  const resultsWithPharmacy = filtered.map(med => {
    const pharmacyInfo = pharmacies.find(
      p => String(p.id) === String(med.pharmacyId) || p._id === med.pharmacyId
    );

    return {
      ...med,
      pharmacyDetails: pharmacyInfo || {
        name: "Unknown",
        address: "Not available",
        phone: "N/A"
      }
    };
  });

  res.json(resultsWithPharmacy);
});

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.send("Inventory Service is running");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Inventory Service running on port ${PORT}`);
});