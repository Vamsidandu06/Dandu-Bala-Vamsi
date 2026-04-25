const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ FINAL MongoDB NON-SRV CONNECTION STRING
const MONGO_URI =
  "mongodb://vamsi271006:passWORD1@ac-9d5h7sc-shard-00-00.uxjfq1x.mongodb.net:27017,ac-9d5h7sc-shard-00-01.uxjfq1x.mongodb.net:27017,ac-9d5h7sc-shard-00-02.uxjfq1x.mongodb.net:27017/travelDB?replicaSet=atlas-2aw8d8-shard-0&authSource=admin&retryWrites=true&w=majority";

// ✅ CONNECT WITH TLS (IMPORTANT)
mongoose
  .connect(MONGO_URI, {
    tls: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:");
    console.error(err);
  });

// Schema
const travelSchema = new mongoose.Schema({
  fromCity: String,
  toCity: String,
  tempFrom: Number,
  tempTo: Number,
  distance: String,
  travelMode: String,
  decision: String,
  date: { type: Date, default: Date.now },
});

// Model
const Travel = mongoose.model("Travel", travelSchema);

// ✅ SAVE API
app.post("/saveTravel", async (req, res) => {
  try {
    const data = new Travel(req.body);
    await data.save();
    res.json({ message: "✅ Saved Successfully" });
  } catch (err) {
    console.error("❌ Save Error:", err);
    res.status(500).json({ message: "Error saving data" });
  }
});

// ✅ GET HISTORY API
app.get("/history", async (req, res) => {
  try {
    const data = await Travel.find().sort({ date: -1 });
    res.json(data);
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    res.status(500).json({ message: "Error fetching data" });
  }
});

// Server
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});