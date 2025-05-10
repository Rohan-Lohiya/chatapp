const express = require("express");
const router = express.Router();
const Chatdata = require("../model/Chatdata");


router.post("/check-user", async (req, res) => {
  const { googleID } = req.body;
  if (!googleID) return res.status(400).json({ error: "Missing Google ID" });

  try {
    const user = await Chatdata.findOne({ myGoogleID: googleID });

    if (user) {
      return res.status(200).json({
        exists: true,
        user: {
          googleID: user.myGoogleID,
          name: user.name,
          image: user.image,
        },
      });
    } else {
      return res.status(404).json({ exists: false });
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// In apiroute.js
router.post("/get-chat-data", async (req, res) => {
  const { googleID } = req.body;
  
  if (!googleID) {
    return res.status(400).json({ error: "Missing Google ID" });
  }

  try {
    const chatData = await Chatdata.findOne({ myGoogleID: googleID });
    if (chatData) {
      return res.status(200).json({ chatData });
    } else {
      return res.status(404).json({ error: "Chat data not found" });
    }
  } catch (error) {
    console.error("Error fetching chat data:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

  module.exports = { router };
  