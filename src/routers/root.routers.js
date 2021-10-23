const express = require('express');
const { authRouter } = require('./auth.routers');
const cinemaRouter = require('./cinema.routers');
const { movieRouter } = require('./movie.routers');
const { ticketRouter } = require('./ticket.route');
const { userRouter } = require('./user.routers');
const rootRouter = express.Router();

rootRouter.use('/users', userRouter);
rootRouter.use('/auth', authRouter);
rootRouter.use('/ticket', ticketRouter);
rootRouter.use('/movies', movieRouter);
rootRouter.use('/cinemas', cinemaRouter);
module.exports = {
    rootRouter,
};
