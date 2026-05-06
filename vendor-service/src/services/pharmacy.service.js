const axios = require("axios");

const CLOUDANT_URL = (process.env.CLOUDANT_URL || "").trim();
const CLOUDANT_USERNAME = process.env.CLOUDANT_USERNAME;
const CLOUDANT_PASSWORD = process.env.CLOUDANT_PASSWORD;

if (!CLOUDANT_URL) {
  throw new Error("CLOUDANT_URL missing");
}

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

const DB = "pharmacies";

async function getPharmacyByEmail(email) {
  try {
    // Log the email being queried
    console.log("Searching pharmacy for email:", email);

    const res = await cloudant.post(`/${DB}/_find`, {
      selector: { email },
    });

    const docs = res.data.docs || [];

    // Log query result
    console.log("Pharmacy query result:", docs);

    if (docs.length === 0) {
      return null;
    }

    // Return first matched document
    return docs[0];
  } catch (err) {
    console.error("Pharmacy fetch error:", err.message);
    throw new Error("Failed to fetch pharmacy");
  }
}

module.exports = {
  getPharmacyByEmail,
};