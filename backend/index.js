const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
const multer = require("multer");

const userRouts = require("./routes/user");
const authRouts = require("./routes/auth");
const pinRouts = require("./routes/pin");

app.use(helmet());
app.use(morgan("common"));

dotenv.config();
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "assets/images")));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log("can  not connected to mongodb", err);
  });

app.use("/api/auth", authRouts);
app.use("/api/user", userRouts);
app.use("/api/pin", pinRouts);

app.listen(8880, () => {
  console.log("post running on port 8800");
});
