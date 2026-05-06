const { verifyToken } = require("../config/appid");
const pharmacyService = require("../services/pharmacy.service");
const axios = require("axios");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Validate Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT
    const decoded = await verifyToken(token);

    let email = decoded.email;

    // Fallback: fetch email from App ID userinfo if missing in token
    if (!email) {
      try {
        const userInfo = await axios.get(
          `${process.env.APPID_ISSUER}/userinfo`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        email = userInfo.data.email;
      } catch (err) {
        console.error(
          "Userinfo fetch failed:",
          err.response?.data || err.message
        );
        return res.status(401).json({ message: "Failed to fetch user info" });
      }
    }

    if (!email) {
      return res.status(400).json({ message: "Email not available" });
    }

    // Fetch pharmacy linked to user
    const pharmacy = await pharmacyService.getPharmacyByEmail(email);

    if (!pharmacy) {
      return res.status(403).json({
        message: "No pharmacy linked to this account",
      });
    }

    // Attach user context to request
    req.user = {
      email,
      role: "vendor",
      pharmacyId: String(pharmacy._id), // normalize to string
    };

    next();
  } catch (err) {
    console.error("Auth error:", err.response?.data || err.message);

    res.status(401).json({ message: "Invalid token" });
  }
};