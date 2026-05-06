const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const controller = require("../controllers/vendor.controller");

// Apply auth + role ONCE for all routes
router.use(auth);
router.use(role);

// Routes (no duplicate middleware)
router.get("/inventory", controller.getInventory);
router.post("/medicine", controller.addMedicine);
router.put("/medicine/:id", controller.updateMedicine);
router.delete("/medicine/:id", controller.deleteMedicine);

// OPTIONAL: keep register public OR protected (choose one)

// OPTION A (recommended): PROTECTED (uses logged-in email)
router.post("/register", controller.registerPharmacy);

// OPTION B (if you want open registration):
// router.post("/register", controller.registerPharmacy); // move ABOVE router.use(auth)

module.exports = router;