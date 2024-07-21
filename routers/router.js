const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function chainHashes(oldHash, newHash) {
  const combinedHashes = `${oldHash}${newHash}`;
  const hash = crypto.createHash("sha256");
  hash.update(combinedHashes);
  return hash.digest("hex");
}
// Utility function to read metadata
function readMetadata(tokenId) {
  const filePath = path.join(
    __dirname,
    "../public/metadata",
    `metadata-${tokenId}.json`
  );
  if (fs.existsSync(filePath)) {
    const metadata = fs.readFileSync(filePath, "utf8");
    return JSON.parse(metadata);
  } else {
    throw new Error("Metadata file not found.");
  }
}

// Fetch metadata route
router.get("/metadata/:tokenId", (req, res) => {
  const { tokenId } = req.params;

  try {
    const metadata = readMetadata(tokenId);
    res.json(metadata);
  } catch (error) {
    console.error("Error reading metadata:", error);
    res.status(404).json({ message: error.message });
  }
});

// Update metadata route
router.post("/update-metadata/:tokenId", (req, res) => {
  const { tokenId } = req.params;
  const { milestones } = req.body;

  const filePath = path.join(
    __dirname,
    "../public/metadata",
    `metadata-${tokenId}.json`
  );
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("Metadata file not found.");
    }

    let metadata = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const oldHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(metadata))
      .digest("hex");

    // Update the metadata with new milestones
    metadata.milestones = milestones;
    fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));

    const newHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(metadata))
      .digest("hex");

    const chainedHash = chainHashes(oldHash, newHash);

    res.status(200).json({
      message: "Metadata updated successfully",
      metadata: metadata,
      chainedHash: chainedHash,
    });
  } catch (error) {
    console.error("Failed to read, update, or write metadata:", error);
    res
      .status(500)
      .json({ message: "Failed to update metadata", error: error.toString() });
  }
});

module.exports = router;
