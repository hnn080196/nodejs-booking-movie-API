const express = require('express');
const authController = require('../controllers/auth.controller');
const authRouter = express.Router();

// http://localhost:9000/auth/sign-in
authRouter.post('/sign-in', authController.signIn);
authRouter.post('/sign-up', authController.signUp);

module.exports = {
    authRouter,
};
