const express = require("express");
require("dotenv").config();

const userRoutes = require("./routes/user.routes");
const commonRoutes = require("./routes/decode.routes");
const pool = require("./config/env.db.config");

pool.connect()
.then(() => console.log("Database connected"))
.catch(err => console.log("Database error:", err));
const app = express();

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/decode", commonRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});