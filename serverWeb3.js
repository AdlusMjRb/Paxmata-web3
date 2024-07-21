const path = require("path");
require("dotenv").config({
  path: "/Users/alexander/rfqbidding/rfqbiddingplatform/backend/.env",
});
const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");

// ABI Imports
const nftContractABI = require("../ABI/PaxmataProjects.json");
const milestoneTrackingABI = require("../ABI/MilestoneTrackingABI.json"); // Ensure this path and filename are correct

const app = express();
const PORT = process.env.PORT || 3003;

// Ethereum provider and signer
const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract addresses from environment variables
const nftContractAddress = process.env.NFT_CONTRACT_ADDRESS;
const milestoneTrackingAddress = process.env.MILESTONE_CONTRACT_ADDRESS; // Milestone contract address

// Contract instances
const nftContract = new ethers.Contract(
  nftContractAddress,
  nftContractABI,
  signer
);
const milestoneTrackingContract = new ethers.Contract(
  milestoneTrackingAddress,
  milestoneTrackingABI,
  signer
);

// Google Cloud Storage initialization
const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  keyFilename: process.env.GCS_KEY_FILE,
});
const bucketName = process.env.GCS_BUCKET_NAME;

// Define upload directory
const uploadDir = path.join(__dirname, "uploads");

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(
  "/metadata",
  express.static(path.join(__dirname, "public", "metadata"))
);

// Log the signer's address
(async () => {
  console.log(`Using signer address: ${await signer.getAddress()}`);
})();

// Fetch milestones
app.get("/api/fetch-milestones", async (req, res) => {
  try {
    const milestonesCount =
      await milestoneTrackingContract._milestoneIdCounter();
    const milestones = [];
    for (let i = 0; i < milestonesCount; i++) {
      const milestone = await milestoneTrackingContract.milestones(i);
      milestones.push({
        description: milestone.description,
        isCompleted: milestone.isCompleted,
        isVerified: milestone.isVerified,
        completionTimestamp: milestone.completionTimestamp.toString(),
        deadline: milestone.deadline.toString(),
        evidenceUrl: milestone.evidenceUrl,
      });
    }
    res.status(200).json({ milestones });
  } catch (error) {
    console.error("Failed to fetch milestones:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add Milestones
app.post("/api/milestones/add", async (req, res) => {
  const { descriptions, deadlines, evidenceUrls } = req.body;
  console.log(
    "Received request to add milestones:",
    descriptions,
    deadlines,
    evidenceUrls
  );

  try {
    // Ensure deadlines are valid UNIX timestamps or default to 0
    const adjustedDeadlines = deadlines.map((d) => {
      const timestamp = Number(d);
      if (isNaN(timestamp)) {
        console.error(`Invalid deadline value: ${d}`);
        throw new Error(`Invalid deadline value: ${d}`);
      }
      return ethers.BigNumber.from(timestamp);
    });

    const transaction = {
      to: milestoneTrackingAddress,
      data: milestoneTrackingContract.interface.encodeFunctionData(
        "addMilestones",
        [descriptions, adjustedDeadlines, evidenceUrls]
      ),
    };

    const txResponse = await sendTransaction(transaction);

    res.status(200).send({
      success: true,
      transactionHash: txResponse.hash,
    });
  } catch (error) {
    console.error("Error adding milestones:", error);
    res.status(500).send({ success: false, error: error.message });
  }
});

// Update metadata hash in NFT contract
app.post("/api/update-metadata", async (req, res) => {
  const { tokenId, milestones } = req.body;
  console.log(
    "Updating metadata for token ID:",
    tokenId,
    "with milestones:",
    milestones
  );

  try {
    const metadataDir = path.join(__dirname, "public", "metadata");
    const metadataFile = path.join(metadataDir, `metadata-${tokenId}.json`);

    if (!fs.existsSync(metadataFile)) {
      throw new Error(`Metadata file for tokenId ${tokenId} does not exist`);
    }

    const metadata = JSON.parse(fs.readFileSync(metadataFile, "utf8"));
    metadata.milestones = milestones;

    fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
    console.log("Updated metadata file:", metadataFile);

    const newJsonHash = computeMetadataHash(metadata);
    const oldHash = await nftContract.getDataHash(tokenId);
    console.log("Old data hash:", oldHash, "New JSON hash:", newJsonHash);

    const combinedData = oldHash + newJsonHash;
    const combinedHash = crypto
      .createHash("sha256")
      .update(combinedData)
      .digest("hex");
    console.log("Combined data hash:", combinedHash);

    const tx = await nftContract.updateDataHash(tokenId, combinedHash);
    console.log("Transaction sent for updating data hash:", tx);

    const receipt = await tx.wait();
    console.log("Transaction receipt for updating data hash:", receipt);

    res.status(200).json({ message: "Metadata and hash updated successfully" });
  } catch (error) {
    console.error("Failed to update metadata and hash:", error);
    res.status(500).json({
      message: "Failed to update metadata and hash",
      error: error.message,
    });
  }
});

// Compute metadata hash
function computeMetadataHash(metadata) {
  const metadataString = JSON.stringify(metadata);
  return crypto.createHash("sha256").update(metadataString).digest("hex");
}

// Save metadata as JSON and return the file path URL
function saveMetadataAsJson(metadata, tokenId, req) {
  const metadataDir = path.join(__dirname, "public", "metadata");
  if (!fs.existsSync(metadataDir)) {
    fs.mkdirSync(metadataDir, { recursive: true });
  }
  const filename = `metadata-${tokenId}.json`;
  const filepath = path.join(metadataDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(metadata, null, 2));
  return `${req.protocol}://${req.get("host")}/metadata/${filename}`;
}

// Validate deadlines and convert to BigNumber or from date strings to BigNumber
function validateAndConvertDeadlines(deadlines) {
  return deadlines.map((deadline) => {
    if (!deadline) {
      throw new Error(`Invalid deadline value: ${deadline}`);
    }

    let timestamp;

    if (typeof deadline === "string" && isNaN(deadline)) {
      // Convert date string to timestamp
      timestamp = Math.floor(new Date(deadline).getTime() / 1000);
      if (isNaN(timestamp)) {
        throw new Error(`Invalid date string for deadline: ${deadline}`);
      }
    } else {
      timestamp = Number(deadline);
    }

    if (isNaN(timestamp) || timestamp <= 0) {
      throw new Error(`Invalid numeric deadline value: ${deadline}`);
    }

    return ethers.BigNumber.from(timestamp);
  });
}

// Function to mint NFT
async function mintNFT(ethereumAddress, metadataUrl, dataHash) {
  try {
    const tx = await nftContract.safeMint(
      ethereumAddress,
      metadataUrl,
      dataHash
    );
    const receipt = await tx.wait();
    const tokenId = receipt.events
      .find((e) => e.event === "Transfer")
      .args.tokenId.toString();
    return { success: true, tokenId, transactionHash: receipt.transactionHash };
  } catch (error) {
    console.error("Minting NFT failed:", error);
    return { success: false, error: error.message };
  }
}

// Function to fetch the current data hash from the NFT contract
async function fetchCurrentDataHash(tokenId) {
  try {
    return await nftContract.getDataHash(tokenId);
  } catch (error) {
    console.error(
      `Error fetching current data hash for tokenId ${tokenId}:`,
      error
    );
    throw new Error(`Query for nonexistent token with tokenId ${tokenId}`);
  }
}

async function sendTransaction(transaction) {
  try {
    // Estimate gas usage
    const estimatedGasLimit = await provider.estimateGas(transaction);
    transaction.gasLimit = estimatedGasLimit;

    // Fetch current gas price
    const gasPrice = await provider.getGasPrice();
    transaction.maxFeePerGas = gasPrice.mul(2);
    transaction.maxPriorityFeePerGas = ethers.utils.parseUnits("1.5", "gwei");

    // Check account balance before sending
    const balance = await provider.getBalance(signer.address);
    const transactionCost = estimatedGasLimit.mul(transaction.maxFeePerGas);

    if (balance.lt(transactionCost)) {
      throw new Error(
        `Insufficient funds for gas: ${ethers.utils.formatEther(
          balance
        )} ETH available, but transaction requires ${ethers.utils.formatEther(
          transactionCost
        )} ETH.`
      );
    }

    // Send transaction
    const txResponse = await signer.sendTransaction(transaction);
    await txResponse.wait();

    console.log("Transaction successful with hash:", txResponse.hash);
    return txResponse;
  } catch (error) {
    console.error("Transaction error:", error);
    throw error;
  }
}

app.post("/api/rfq", async (req, res) => {
  const {
    projectType,
    projectDescription,
    estimatedCost,
    estimatedTimescale,
    projectLocation,
    isInvestable,
    investmentGoal,
    ethereumAddress,
    badges,
  } = req.body;

  if (!projectDescription || !ethereumAddress) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // Create metadata
    const metadata = {
      projectType,
      projectDescription,
      estimatedCost,
      estimatedTimescale,
      projectLocation,
      isInvestable,
      investmentGoal,
      ethereumAddress,
      badges,
      timestamp: Date.now(),
    };

    // Compute data hash
    const dataHash = computeMetadataHash(metadata);

    // Mint NFT
    const tx = await nftContract.safeMint(ethereumAddress, "", dataHash);
    const receipt = await tx.wait();
    const tokenId = receipt.events
      .find((e) => e.event === "Transfer")
      .args.tokenId.toString();

    // Save metadata with the actual token ID
    const metadataUrl = saveMetadataAsJson(metadata, tokenId, req);

    console.log("NFT minted successfully. Token ID:", tokenId);

    res.status(200).json({
      tokenId,
      transactionHash: receipt.transactionHash,
      metadataUrl,
    });
  } catch (error) {
    console.error("Error processing /api/rfq:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Fetch milestone by ID
app.get("/api/milestones/:milestoneId", async (req, res) => {
  const { milestoneId } = req.params;

  try {
    const milestone = await milestoneTrackingContract.milestones(milestoneId);
    res.status(200).json({ milestone });
  } catch (error) {
    console.error("Error fetching milestone:", error);
    res.status(500).send({ success: false, error: error.message });
  }
});

// Complete milestone
app.post("/api/milestones/complete", async (req, res) => {
  const { milestoneId } = req.body;

  try {
    const tx = await milestoneTrackingContract.completeMilestone(milestoneId);
    await tx.wait();
    res.status(200).json({ message: "Milestone completed successfully" });
  } catch (error) {
    console.error("Error completing milestone:", error);
    res
      .status(500)
      .json({ message: "Error completing milestone", error: error.message });
  }
});

// Schedule this with a node cron job or similar if you want it to run periodically
app.post("/api/milestones/check-expired", async (req, res) => {
  try {
    const tx = await milestoneTrackingContract.checkExpiredMilestones();
    await tx.wait();
    res.status(200).send({
      success: true,
      message: "Expired milestones checked and updated.",
    });
  } catch (error) {
    console.error("Error checking expired milestones:", error);
    res.status(500).send({ success: false, error: error.message });
  }
});

// Verify milestone
app.post("/api/milestones/verify", async (req, res) => {
  const { milestoneId, verified, verifierComment } = req.body;

  try {
    const tx = await milestoneTrackingContract.verifyMilestone(
      milestoneId,
      verified,
      verifierComment
    );
    await tx.wait();
    res.status(200).json({ message: "Milestone verified successfully" });
  } catch (error) {
    console.error("Error verifying milestone:", error);
    res
      .status(500)
      .json({ message: "Error verifying milestone", error: error.message });
  }
});

const storageMulter = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storageMulter });

// Image upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const localFilePath = path.join(uploadDir, req.file.filename);

  try {
    await storage
      .bucket(bucketName)
      .upload(localFilePath, { destination: req.file.filename });

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${req.file.filename}`;
    fs.unlinkSync(localFilePath);

    res.json({ fileUrl: publicUrl });
  } catch (error) {
    console.error("Error uploading to Google Cloud Storage:", error);
    res
      .status(500)
      .json({ message: "Failed to upload to Google Cloud Storage" });
  }
});

// Endpoint to fetch all NFTs owned by a given address
app.get("/api/nfts/:address", async (req, res) => {
  const { address } = req.params;
  console.log(`Fetching NFTs for address: ${address}`);
  try {
    // Fetch all token IDs owned by the address
    const tokenIds = await nftContract.getTokenIdsOwnedBy(address);
    if (!tokenIds.length) {
      return res
        .status(404)
        .json({ error: "No tokens found for this address." });
    }

    // Fetch metadata for each token
    const tokensData = await Promise.all(
      tokenIds.map(async (tokenId) => {
        const tokenUri = await nftContract.tokenURI(tokenId);
        const response = await fetch(tokenUri);
        if (!response.ok) throw new Error(`Failed to fetch URI: ${tokenUri}`);
        const metadata = await response.json();
        return { tokenId: tokenId.toString(), metadataUrl: tokenUri, metadata };
      })
    );

    res.json(tokensData.filter((token) => token !== null));
  } catch (error) {
    console.error(`Failed to fetch NFT data for address: ${address}`, error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.toString() });
  }
});

// Endpoint to fetch all project metadata
app.get("/api/projects", async (req, res) => {
  const metadataDir = path.join(__dirname, "public", "metadata");
  try {
    const files = fs.readdirSync(metadataDir);
    const projects = files.map((file) => {
      const filePath = path.join(metadataDir, file);
      const fileContents = JSON.parse(fs.readFileSync(filePath, "utf8"));
      return {
        id: file.split("-")[1].split(".")[0], // Unique ID derived from filename
        projectType: fileContents.projectType,
        projectDescription: fileContents.projectDescription,
        estimatedCost: fileContents.estimatedCost,
        estimatedTimescale: fileContents.estimatedTimescale,
        projectLocation: fileContents.projectLocation,
        isInvestable: fileContents.isInvestable,
        investmentGoal: fileContents.investmentGoal,
        ethereumAddress: fileContents.ethereumAddress,
        metadataUrl: `${req.protocol}://${req.get("host")}/metadata/${file}`,
      };
    });
    res.json(projects);
  } catch (error) {
    console.error("Failed to read metadata directory:", error);
    res.status(500).json({ message: "Failed to load projects" });
  }
});

// Endpoint to fetch project metadata by ID
app.get("/api/projects/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`Fetching project details for ID: ${id}`);

  const metadataDir = path.join(__dirname, "public", "metadata");
  const metadataFile = path.join(metadataDir, `metadata-${id}.json`);

  if (!fs.existsSync(metadataFile)) {
    console.error(`Metadata file not found: ${metadataFile}`);
    return res.status(404).json({ message: "Project not found" });
  }

  try {
    const metadata = JSON.parse(fs.readFileSync(metadataFile, "utf8"));
    res.json({
      id,
      projectType: metadata.projectType,
      projectDescription: metadata.projectDescription,
      estimatedCost: metadata.estimatedCost,
      estimatedTimescale: metadata.estimatedTimescale,
      projectLocation: metadata.projectLocation,
      isInvestable: metadata.isInvestable,
      investmentGoal: metadata.investmentGoal,
      ethereumAddress: metadata.ethereumAddress,
      milestones: metadata.milestones || [],
    });
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).json({
      message: "Error fetching project details",
      error: error.toString(),
    });
  }
});

app.listen(PORT, () => {
  console.log(`ServerWeb3 running on port ${PORT}`);
});

// Listen for contract events and update metadata accordingly
function listenForEvents() {
  milestoneTrackingContract.on(
    "MilestoneAdded",
    async (milestoneId, description, deadline, evidenceUrl) => {
      console.log("Milestone Added:", {
        milestoneId,
        description,
        deadline,
        evidenceUrl,
      });
      try {
        // Fetch the tokenId associated with this milestone
        const tokenId = await getTokenIdFromMilestone(milestoneId);
        const metadata = readMetadata(tokenId);

        // Update the metadata with the new milestone address
        metadata.milestones.push({
          milestoneId,
          description,
          deadline,
          evidenceUrl,
          milestoneAddress: milestoneTrackingAddress, // add the milestone contract address
        });
        fs.writeFileSync(
          path.join(
            __dirname,
            "../public/metadata",
            `metadata-${tokenId}.json`
          ),
          JSON.stringify(metadata, null, 2)
        );

        // Optionally, update the data hash on the blockchain
        const newHash = computeMetadataHash(metadata);
        const tx = await nftContract.updateDataHash(tokenId, newHash);
        await tx.wait();
      } catch (error) {
        console.error(
          "Error updating metadata for MilestoneAdded event:",
          error
        );
      }
    }
  );

  // Add similar listeners for other events if necessary
}

// Call listenForEvents function to start listening
listenForEvents();
