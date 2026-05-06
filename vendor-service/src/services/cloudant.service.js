const axios = require("axios");

const CLOUDANT_URL = (process.env.CLOUDANT_URL || "").trim();
const CLOUDANT_USERNAME = process.env.CLOUDANT_USERNAME;
const CLOUDANT_PASSWORD = process.env.CLOUDANT_PASSWORD;

if (!CLOUDANT_URL) {
  throw new Error("CLOUDANT_URL missing");
}

const DB = "medicines";

const cloudant = axios.create({
  baseURL: CLOUDANT_URL,
  auth: {
    username: CLOUDANT_USERNAME,
    password: CLOUDANT_PASSWORD,
  },
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * GET medicines by pharmacy
 */
async function getMedicines(pharmacyId) {
  try {
    const res = await cloudant.post(`/${DB}/_find`, {
      selector: {
        $or: [
          { pharmacyId: String(pharmacyId) },
          { pharmacyId: Number(pharmacyId) },
        ],
      },
    });

    const docs = res.data.docs || [];

    console.log("Filtered medicines:", docs.length);

    return docs;
  } catch (err) {
    console.error("Cloudant GET error:", err.message);
    throw new Error("Failed to fetch medicines");
  }
}

/**
 * ADD medicine
 */
async function addMedicine(doc) {
  try {
    const res = await cloudant.post(`/${DB}`, doc);
    return res.data;
  } catch (err) {
    console.error("Cloudant ADD error:", err.message);
    throw new Error("Failed to add medicine");
  }
}

/**
 * UPDATE medicine
 */
async function updateMedicine(id, data) {
  try {
    const existing = await cloudant.get(`/${DB}/${id}`);

    const updated = {
      ...existing.data,
      ...data,
    };

    const res = await cloudant.put(`/${DB}/${id}`, updated);
    return res.data;
  } catch (err) {
    console.error("Cloudant UPDATE error:", err.message);
    throw new Error("Failed to update medicine");
  }
}

/**
 * DELETE medicine
 */
async function deleteMedicine(id) {
  try {
    const existing = await cloudant.get(`/${DB}/${id}`);

    const res = await cloudant.delete(
      `/${DB}/${id}?rev=${existing.data._rev}`
    );

    return res.data;
  } catch (err) {
    console.error("Cloudant DELETE error:", err.message);
    throw new Error("Failed to delete medicine");
  }
}
async function getMedicineById(id) {
  try {
    const res = await cloudant.get(`/${DB}/${id}`);
    return res.data;
  } catch (err) {
    return null;
  }
}
module.exports = {
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getMedicineById,
};