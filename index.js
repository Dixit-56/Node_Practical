const express = require("express");
const bodyParser = require("body-parser");
const { User } = require("./src/Routes/index.js");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

// Use user routes
app.use("/user", User.route);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
