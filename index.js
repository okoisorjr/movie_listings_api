require("dotenv").config();

const express = require("express");
const { default: mongoose } = require("mongoose");
const authRoute = require("./src/routes/authRoutes");
const movieRoute = require("./src/routes/movieRoutes");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const https = require("https");
const fs = require("fs");

const app = express();

const corsOptions = {
  origin: ["*", "http://localhost:5173", "http:127.0.0.1:5173"], // Allow only this origin
  methods: ["GET", "POST"], // Allow only these HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
};

//app.use(cors(corsOptions));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/movielist", authRoute);
app.use("/api/v1/movielist/all", movieRoute);

// cloud storage configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Load SSL certificate and key
const options = {
  key: fs.readFileSync("./privkey.pem"),
  cert: fs.readFileSync("./fullchain.pem"),
};

mongoose.connect(process.env.MONGO_URI).then((instance) => {
  console.log("database connected successfully!");
  https.createServer(options, app).listen(process.env.PORT, () => {
    console.log("server is running on port::", process.env.PORT);
  });
  /* app.listen(process.env.PORT, () => {
    console.log("server is running on port::", process.env.PORT);
  }); */
});
