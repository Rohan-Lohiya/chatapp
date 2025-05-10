const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectToDatabase = require("./dbconnection/database");
const dotenv = require("dotenv");
const setupSocket = require("./Socket");
const {router : apiroute} = require("./controller/apiroute");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for REST API (if needed)
app.use(cors({ 
  origin: "http://localhost:3000", 
  methods: ["GET", "POST"],
  credentials: true // Add this line
}));

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend origin
    methods: ["GET", "POST"],
    credentials: true // This is the missing piece for Socket.IO CORS
  }
});

app.use("/api", apiroute); // Use the router for checking user existence

connectToDatabase()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });
  
setupSocket(io);  

httpServer.listen(5000, () => {
  console.log("Server running on port 5000"); // Fixed the log message to show 5000 instead of 3000
});