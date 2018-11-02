// General Dependencies
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;

// Database
const mongoose = require("mongoose");
const db = process.env.DBURL;
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected to Database 💿=👍🏼"))
  .catch(err => console.log(err));

// Routes
const users = require("./routes/api/users");
const accounts = require("./routes/api/accounts");
const trips = require("./routes/api/trips");
const vehicles = require("./routes/api/vehicles");

// Use Routes
app.use("/api/users", users);
app.use("/api/accounts", accounts);
app.use("/api/trips", trips);
app.use("/api/vehicles", vehicles);

app.get("/", (req, res) => res.send("Hello"));

// Lets get this party Started!
app.listen(port, () => console.log(`Server running on port ${port} 🖥=👍🏼`));
