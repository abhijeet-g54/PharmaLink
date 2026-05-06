const axios = require("axios");

exports.exchangeToken = async (req, res) => {
  const { code } = req.body;

  try {
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

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Token exchange failed" });
  }
};