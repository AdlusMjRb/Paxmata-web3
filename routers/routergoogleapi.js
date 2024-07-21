const express = require("express");
const router = express.Router();
const {
  analyzeEntitiesWithGoogleAPI,
  getMostRecentFile,
} = require("../utils/googleAPI"); // Adjust path as necessary
const { RESPONSE_DIR } = require("../config/index"); // Make sure this path is correctly set in your config

/**
 * POST endpoint to process the latest JSON file and analyze its content.
 */
router.post("/process-latest-response", async (req, res) => {
  try {
    // Get the path of the most recent file from the specified directory
    const filePath = await getMostRecentFile(RESPONSE_DIR);
    if (!filePath) {
      return res.status(404).json({ message: "No recent file found." });
    }

    // Analyze the entities of the content in the most recent file
    const entities = await analyzeEntitiesWithGoogleAPI(filePath);
    res.json({ success: true, entities });
  } catch (error) {
    console.error("Error processing the latest file:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process the file",
      error: error.toString(),
    });
  }
});

module.exports = router;
