const express = require("express");
const cors = require("cors");
const axios = require("axios");

const vendorRoutes = require("./routes/vendor.routes");

const app = express();

app.use(cors());
app.use(express.json());

/**
 * Root endpoint
 */
app.get("/", (req, res) => {
  res.send("Vendor Service Running");
});

/**
 * App ID login entry point
 */
app.get("/login", (req, res) => {
  const url = `${process.env.APPID_ISSUER}/authorization?client_id=${process.env.APPID_CLIENT_ID}&response_type=code&redirect_uri=${process.env.APPID_REDIRECT_URI}&scope=openid%20email`;

  res.redirect(url);
});

/**
 * OAuth callback: exchange code for token, fetch user info,
 * map to pharmacy, and redirect frontend
 */
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.send("No code received");
  }

  try {
    // Exchange authorization code for access token
    const response = await axios.post(
      `${process.env.APPID_ISSUER}/token`,
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.APPID_CLIENT_ID,
        client_secret: process.env.APPID_CLIENT_SECRET,
        redirect_uri: process.env.APPID_REDIRECT_URI,
        code,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = response.data.access_token;

    // Fetch user info using access token
    const userInfo = await axios.get(`${process.env.APPID_ISSUER}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const email = userInfo.data.email;

    // Setup Cloudant client
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

    // Check if pharmacy exists for this email
    const existing = await cloudant.post("/pharmacies/_find", {
      selector: { email },
    });

    let pharmacyId;

    if (existing.data.docs.length === 0) {
      // Create new pharmacy if none exists
      const newDoc = {
        _id: Date.now().toString(),
        name: email.split("@")[0] + " Pharmacy",
        address: "",
        email,
        phone: "",
      };

      const created = await cloudant.post("/pharmacies", newDoc);
      pharmacyId = created.data.id || newDoc._id;

      console.log("New pharmacy created:", email);
    } else {
      pharmacyId = existing.data.docs[0]._id;
    }

    // Final frontend redirect URL
    const redirectURL = `http://localhost:5173/vendor?token=${accessToken}`;

    console.log("Redirecting to:", redirectURL);

    // Send HTML that triggers client-side redirect
    res.send(`
      <html>
        <head>
          <title>Redirecting...</title>
        </head>
        <body>
          <script>
            window.location.href = "${redirectURL}";
          </script>
        </body>
      </html>
    `);

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Token exchange failed");
  }
});

/**
 * Vendor routes
 */
app.use("/vendor", vendorRoutes);

module.exports = app;