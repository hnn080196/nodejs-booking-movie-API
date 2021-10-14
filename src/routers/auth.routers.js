const express = require("express");
const { signIn } = require("../controllers/auth.controller");
const authRouter = express.Router();

// http://localhost:9000/auth/sign-in
authRouter.post("/sign-in", signIn);

module.exports = {
  authRouter,
};
