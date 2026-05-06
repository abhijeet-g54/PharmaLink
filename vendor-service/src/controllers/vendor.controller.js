const cloudantService = require("../services/cloudant.service");
const axios = require("axios");

/**
 * GET INVENTORY
 */
exports.getInventory = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);

    const pharmacyId = req.user?.pharmacyId;

    if (!pharmacyId) {
      return res.status(400).json({
        message: "pharmacyId missing in request",
      });
    }

    const data = await cloudantService.getMedicines(pharmacyId);

    console.log("Fetched medicines:", data.length);

    res.json(data);
  } catch (err) {
    console.error("getInventory error:", err.message);

    res.status(500).json({
      message: "Failed to fetch inventory",
    });
  }
};

/**
 * ADD MEDICINE
 */
exports.addMedicine = async (req, res) => {
  try {
    // Validate user and pharmacyId
    if (!req.user || !req.user.pharmacyId) {
      console.error("REQ.USER INVALID:", req.user);
      return res.status(401).json({
        message: "Unauthorized: pharmacyId missing",
      });
    }

    const pharmacyId = String(req.user.pharmacyId);

    // Remove restricted fields from client input
    const {
      _id,
      _rev,
      pharmacyId: ignored,
      ...safeData
    } = req.body;

    // Basic validation to prevent empty inserts
    if (!safeData.name) {
      return res.status(400).json({
        message: "Medicine name is required",
      });
    }

    const newMed = {
      ...safeData,
      pharmacyId, // enforced from backend only
      createdAt: new Date(),
    };

    const result = await cloudantService.addMedicine(newMed);

    res.json({
      message: "Medicine added",
      data: result,
    });
  } catch (err) {
    console.error("Add error FULL:", err); // log full error

    res.status(500).json({
      message: "Failed to add medicine",
    });
  }
};

/**
 * UPDATE MEDICINE
 */
exports.updateMedicine = async (req, res) => {
  try {
    const pharmacyId = String(req.user.pharmacyId);
    const id = req.params.id;

    const existing = await cloudantService.getMedicineById(id);

    if (!existing) {
      return res.status(404).json({
        message: "Medicine not found",
      });
    }

    // Ensure the medicine belongs to the requesting pharmacy
    if (String(existing.pharmacyId) !== pharmacyId) {
      return res.status(403).json({
        message: "Unauthorized: cannot edit other pharmacy data",
      });
    }

    // Remove restricted fields from updates
    const {
      _id,
      _rev,
      pharmacyId: ignored,
      ...safeUpdates
    } = req.body;

    const updated = await cloudantService.updateMedicine(id, safeUpdates);

    res.json({
      message: "Medicine updated",
      data: updated,
    });
  } catch (err) {
    console.error("Update error:", err.message);

    res.status(500).json({
      message: "Failed to update medicine",
    });
  }
};

/**
 * DELETE MEDICINE
 */
exports.deleteMedicine = async (req, res) => {
  try {
    const pharmacyId = String(req.user.pharmacyId);
    const id = req.params.id;

    const existing = await cloudantService.getMedicineById(id);

    if (!existing) {
      return res.status(404).json({
        message: "Medicine not found",
      });
    }

    // Ensure the medicine belongs to the requesting pharmacy
    if (String(existing.pharmacyId) !== pharmacyId) {
      return res.status(403).json({
        message: "Unauthorized: cannot delete other pharmacy data",
      });
    }

    const result = await cloudantService.deleteMedicine(id);

    res.json({
      message: "Medicine deleted",
      data: result,
    });
  } catch (err) {
    console.error("Delete error:", err.message);

    res.status(500).json({
      message: "Failed to delete medicine",
    });
  }
};

/**
 * REGISTER PHARMACY (Optional)
 */
exports.registerPharmacy = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "name and email required",
      });
    }

    const cloudant = axios.create({
      baseURL: process.env.CLOUDANT_URL,
      auth: {
        username: process.env.CLOUDANT_USERNAME,
        password: process.env.CLOUDANT_PASSWORD,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    const existing = await cloudant.post("/pharmacies/_find", {
      selector: { email },
    });

    if (existing.data.docs.length > 0) {
      return res.status(400).json({
        message: "Pharmacy already exists for this email",
      });
    }

    const doc = {
      _id: Date.now().toString(),
      name,
      address: "",
      email,
      phone: "",
    };

    const response = await cloudant.post("/pharmacies", doc);

    res.json({
      message: "Pharmacy registered successfully",
      data: response.data,
    });
  } catch (err) {
    console.error("Register error:", err.message);

    res.status(500).json({
      message: "Registration failed",
    });
  }
};