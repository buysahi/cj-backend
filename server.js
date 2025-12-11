const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// TODO: Insert your own keys here
const appKey = "YOUR_APP_KEY";
const appSecret = "YOUR_APP_SECRET";

let accessToken = "";

// Function to refresh CJ access token
async function refreshToken() {
  try {
    const res = await axios.post(
      "https://developers.cjdropshipping.com/api2.0/open/getAccessToken",
      { appKey, appSecret }
    );
    accessToken = res.data.data.accessToken;
    console.log("New access token:", accessToken);
  } catch (error) {
    console.error("Error refreshing token:", error.response?.data || error);
  }
}

// Get Products API
app.get("/products", async (req, res) => {
  try {
    if (!accessToken) await refreshToken();

    const result = await axios.post(
      "https://developers.cjdropshipping.com/api2.0/product/list",
      { pageNum: 1, pageSize: 20 },
      { headers: { token: accessToken } }
    );

    res.json(result.data);
  } catch (error) {
    res.status(500).json(error.response?.data || error);
  }
});

// Home route
app.get("/", (req, res) => {
  res.send("CJ Backend is running 🚀");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
