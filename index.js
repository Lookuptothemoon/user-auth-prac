const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// config .env file
dotenv.config();

// connect to DB
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
  console.log("connected to DB!")
);

// import routes
const authRoute = require("./routes/auth");
const PostRoute = require("./routes/post");

// MIDDLEWARES
app.use(express.json());
// route middleware
app.use("/api/user", authRoute);
app.use("/api/posts", PostRoute);

app.listen(3000, () => console.log("Server is up and running"));
