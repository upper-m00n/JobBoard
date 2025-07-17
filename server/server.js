// server.js
require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require('./routes/jobRoutes')
const applicationRoutes = require('./routes/applicationRoutes')
const resumeRoutes = require('./routes/resumeBuilder')


dotenv.config();

const app = express();
app.use(cors({
  origin: [
    'https://job-board-pied-eight.vercel.app', 
    'http://localhost:3000' 
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH','DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes)
app.use("/api/resume", resumeRoutes)

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API is working");
});
