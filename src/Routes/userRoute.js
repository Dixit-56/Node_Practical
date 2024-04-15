const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const validate = require("../Middlewares/validate");
const user = require("../Validations/user");

// Route to register a new user
router.post(
  "/register",
  validate(user.registerUser),
  userController.registerUser
);

// Route to login
router.post("/login", validate(user.loginUser), userController.login);

module.exports = {
  route: router,
};
