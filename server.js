const path = require("path");
require("dotenv").config({
  path: "/Users/alexander/rfqbidding/rfqbiddingplatform/backend/.env",
});
console.log(process.env.JWT_SECRET);
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const app = express();
const PORT = process.env.PORT || 3001;
const fs = require("fs"); // Add this line to import the fs module

app.use(express.json());
app.use(cors());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

(async () => {
  try {
    await client.connect();
    db = client.db("LifeJacketDB");
    console.log("Connected successfully to MongoDB");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
  }
})();

app.post("/api/milestones/emergency", async (req, res) => {
  const { milestoneId } = req.body;

  try {
    if (!ObjectId.isValid(milestoneId)) {
      return res.status(400).json({ message: "Invalid Milestone ID" });
    }

    const result = await db
      .collection("Milestones")
      .updateOne(
        { _id: ObjectId(milestoneId) },
        { $set: { status: "emergency" } }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    res.json({ message: "Emergency declared on milestone successfully" });
  } catch (error) {
    console.error("Error declaring emergency on milestone:", error);
    res
      .status(500)
      .json({
        message: "Error declaring emergency on milestone",
        error: error.toString(),
      });
  }
});

// New endpoint to add sub-milestone to a milestone
app.post("/api/milestones/:milestoneId/sub-milestones", async (req, res) => {
  const { milestoneId } = req.params;
  const subMilestone = req.body;

  try {
    if (!ObjectId.isValid(milestoneId)) {
      return res.status(400).json({ message: "Invalid Milestone ID" });
    }

    const result = await db
      .collection("Milestones")
      .updateOne(
        { _id: ObjectId(milestoneId) },
        { $push: { subMilestones: subMilestone } }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    res.json({ message: "Sub-milestone added successfully" });
  } catch (error) {
    console.error("Error adding sub-milestone:", error);
    res
      .status(500)
      .json({ message: "Error adding sub-milestone", error: error.toString() });
  }
});

app.post("/api/milestones", async (req, res) => {
  const { rfqId, milestones } = req.body;

  try {
    // Verify rfqId is valid
    if (!ObjectId.isValid(rfqId)) {
      return res.status(400).json({ message: "Invalid RFQ ID" });
    }

    // Add an rfqId reference to each milestone
    const milestonesWithRfqId = milestones.map((ms) => ({
      ...ms,
      rfqId: ObjectId(rfqId),
    }));

    // Insert milestones into the database
    const result = await db
      .collection("Milestones")
      .insertMany(milestonesWithRfqId);
    res.status(201).json({
      message: "Milestones created successfully",
      milestones: result.ops,
    });
  } catch (error) {
    console.error("Error creating milestones:", error);
    res
      .status(500)
      .json({ message: "Error creating milestones", error: error.toString() });
  }
});

app.get("/api/milestones/:rfqId", async (req, res) => {
  const { rfqId } = req.params;

  try {
    // Verify rfqId is valid
    if (!ObjectId.isValid(rfqId)) {
      return res.status(400).json({ message: "Invalid RFQ ID" });
    }

    // Find all milestones for the given RFQ
    const milestones = await db
      .collection("Milestones")
      .find({ rfqId: ObjectId(rfqId) })
      .toArray();

    if (!milestones) {
      return res
        .status(404)
        .json({ message: "Milestones not found for the given RFQ ID" });
    }
    res.json(milestones);
  } catch (error) {
    console.error("Error retrieving milestones:", error);
    res.status(500).json({
      message: "Error retrieving milestones",
      error: error.toString(),
    });
  }
});

app.post("/api/register", async (req, res) => {
  const { username, password, email, role } = req.body;
  console.log("Attempting to register user:", { username, email, role });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username: username.trim().toLowerCase(),
      password: hashedPassword,
      email,
      role,
      createdAt: new Date(),
    };

    const result = await db.collection("Registrations").insertOne(newUser);
    console.log("New user registered with ID:", result.insertedId);

    const payload = {
      id: result.insertedId,
      username,
      email,
      role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("JWT generated");

    res.status(201).json({
      message: "User registered successfully",
      token: "Bearer " + token,
      user: payload,
    });
  } catch (error) {
    console.error("Registration failed:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error.toString(),
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Attempting to find user:", username);

    const usersCollection = db.collection("Registrations");
    const user = await usersCollection.findOne({ username });

    console.log("Found user:", user);

    if (!user) {
      console.log("User not found for username:", username);
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid credentials for user:", username);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 }, // 1 hour
      (err, token) => {
        if (err) {
          console.error("Token generation failed:", err);
          return res.status(500).json({
            message: "Token generation failed",
            error: err.toString(),
          });
        }
        res.json({
          success: true,
          token: token,
          user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role,
          },
        });
      }
    );
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ message: "Login failed", error: error.toString() });
  }
});

app.post("/api/rfq", async (req, res) => {
  const {
    projectDescription,
    estimatedCost,
    estimatedTimescale,
    projectLocation,
    isInvestable,
    investmentGoal,
    ethereumAddress,
  } = req.body;
  try {
    const newRFQ = {
      projectDescription,
      estimatedCost,
      estimatedTimescale,
      projectLocation,
      isInvestable,
      investmentGoal,
      ethereumAddress,
      createdAt: new Date(), // Store the date of creation
    };
    await db.collection("RFQForms").insertOne(newRFQ);
    res.status(201).json({ message: "RFQ saved successfully", data: newRFQ });
  } catch (error) {
    console.error("Failed to save RFQ:", error);
    res
      .status(500)
      .json({ message: "Failed to save RFQ", error: error.toString() });
  }
});

// Server.js
// Endpoint to get all RFQs without requiring login
// Public RFQ retrieval endpoint
app.get("/api/rfqs", async (req, res) => {
  try {
    const rfqs = await db.collection("RFQForms").find().toArray(); // Retrieve all RFQs without user filtering
    if (rfqs.length === 0) {
      return res.status(404).json({ message: "No RFQs found." });
    }
    res.json(rfqs); // Send all RFQs to the client
  } catch (error) {
    console.error("Error retrieving RFQs:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.toString(),
    });
  }
});

app.get("/api/milestones/:id", async (req, res) => {
  const projectId = req.params.id;

  try {
    // Verify if projectId is a valid ObjectId
    if (!ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const milestones = await fetchMilestonesForProject(projectId);

    // Check if milestones are found
    if (milestones.length === 0) {
      return res
        .status(404)
        .json({ message: "No milestones found for the project" });
    }

    res.json(milestones);
  } catch (error) {
    console.error("Failed to fetch milestones:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.toString() });
  }
});

async function fetchMilestonesForProject(projectId) {
  // Assuming db is already connected and accessible as a global or through some context
  return await db
    .collection("Milestones")
    .find({ projectId: ObjectId(projectId) })
    .toArray();
}

app.get("/api/rfq/details/:id", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "No authorization token provided." });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const rfqId = req.params.id;

    const collection = db.collection("RFQforms");
    const rfq = await collection.findOne({
      _id: new ObjectId(rfqId),
      userId: decoded.id,
    });
    if (!rfq) {
      return res.status(404).json({ message: "RFQ not found" });
    }
    console.log("RFQ details fetched successfully:", rfq);
    res.json(rfq);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
    console.error("Error fetching RFQ details:", error);
    res.status(500).send("Server error");
  }
});

app.get("/api/current_user", async (req, res) => {
  console.log("Current user request received", req.headers.authorization);
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("Authorization header is missing.");
    return res
      .status(401)
      .json({ message: "No authorization token provided." });
  }

  try {
    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      console.log("Authorization header is not in Bearer token format.");
      return res.status(401).json({
        message: "Authorization header is not in Bearer token format.",
      });
    }

    const token = tokenParts[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      console.log("Token could not be decoded.");
      return res
        .status(401)
        .json({ message: "Authorization token is invalid." });
    }

    const user = await db
      .collection("Registrations")
      .findOne(
        { _id: new ObjectId(decodedToken.id) },
        { projection: { password: 0 } }
      );

    if (!user) {
      console.log("User with provided token does not exist.");
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error("JWT error:", error.message);
      return res.status(401).json({ message: "Invalid or expired token." });
    }
    console.error("Server error when fetching current user:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.toString() });
  }
});

const metadataDirectory = path.join(__dirname, "public", "metadata");
app.use("/api/metadata", express.static(metadataDirectory));

app.get("/api/metadata", (req, res) => {
  fs.readdir(metadataDirectory, (err, files) => {
    if (err) {
      console.error("Error reading metadata directory:", err);
      return res.status(500).json({ message: "Failed to list metadata files" });
    }
    const jsonFiles = files.filter((file) => file.endsWith(".json"));
    res.json(jsonFiles);
  });
});

// Endpoint to fetch content of a specific JSON file
app.get("/api/metadata/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(metadataDirectory, filename);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return res.status(500).json({ message: "Failed to read JSON file" });
    }
    res.json(JSON.parse(data));
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use((error, req, res, next) => {
  console.error("Uncaught error:", error);
  res.status(500).json({ message: "Internal Server Error" });
});
