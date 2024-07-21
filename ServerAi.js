const path = require("path");
require("dotenv").config({
  path: "/Users/alexander/rfqbidding/rfqbiddingplatform/backend/.env",
});
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs").promises;

const app = express();
const PORT = process.env.AI_SERVER_PORT || 3002;

app.use(express.json());
app.use(cors());

// Generate Detailed Plan Endpoint
app.post("/generate-detailed-plan", async (req, res) => {
  const { projectDescription } = req.body;
  if (!projectDescription) {
    return res
      .status(400)
      .json({ message: "Project description is required." });
  }

  const prompt = `
    Please generate a detailed project plan adhering to typical industry standards including:
    - Project Title
    - Duration
    - Milestones with:
      * Title
      * Duration
      * Tasks Involved
      * Payment details, if applicable
    User input: ${projectDescription}
  `;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "Generate a project plan with detailed milestones, including tasks and payment details.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1500,
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (
      !response.data ||
      !response.data.choices ||
      response.data.choices.length === 0
    ) {
      throw new Error("No valid response from GPT-4");
    }

    const detailedPlan = response.data.choices[0].message.content;
    const milestones = extractMilestones(detailedPlan);

    console.log("Extracted Milestones:", milestones);

    if (milestones.length === 0) {
      console.error("No milestones extracted. Check regex and input format.");
      return res.status(500).json({
        message: "Failed to extract milestones from the detailed plan.",
      });
    }

    const filePath = await saveResponseToFile(milestones);
    res.json({ success: true, detailedPlan: milestones, filePath });
  } catch (error) {
    console.error("Error generating detailed plan:", error);
    res.status(500).json({
      message: "Failed to generate detailed project plan",
      error: error.toString(),
    });
  }
});

// Extract milestones from the detailed plan
function extractMilestones(detailedPlan) {
  const milestoneRegex =
    /(?:Milestone\s+|Project\s+Milestone\s+|Project\s+Phase\s+)(\d+):?\s*(.*?)\n.*?Duration:\s*(.*?)\nTasks\s+Involved:\s*((?:- [^\n]*\n)+)(Payment\s+Details: [^\n]*)?/gis;
  let match;
  const milestones = [];

  while ((match = milestoneRegex.exec(detailedPlan)) !== null) {
    let [_, number, title, duration, tasks, paymentDetails] = match;
    tasks = tasks
      .trim()
      .split("\n")
      .map((task) => task.substring(2).trim());
    milestones.push({
      title,
      description: tasks.join(", "),
      duration,
      paymentDetails: paymentDetails
        ? paymentDetails.trim().substring(15).trim()
        : "N/A",
    });
  }

  return milestones;
}

// Save the response to a file
async function saveResponseToFile(milestones) {
  const dirPath = path.join(__dirname, "GPTresponse");
  const filename = `Plan-${Date.now()}.json`;
  const filePath = path.join(dirPath, filename);

  await fs.mkdir(dirPath, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify({ milestones }, null, 2), "utf8");
  console.log("Response saved to file successfully at:", filePath);
  return filePath;
}

// AI Analysis Endpoint
app.post("/analyze-image", async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ message: "Image URL is required." });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "give me a breakdown of the materals you see in this image?",
              },
              {
                type: "image_url",
                image_url: { url: imageUrl },
              },
            ],
          },
        ],
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const description = response.data.choices[0].message.content;
    res.json({ description });
  } catch (error) {
    console.error("Error analyzing image:", error);
    res.status(500).json({
      message: "Failed to analyze image",
      error: error.toString(),
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
