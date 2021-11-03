const express = require('express');
const { authRouter } = require('./auth.routers');
const cinemaRouter = require('./cinema.routers');
const { movieRouter } = require('./movie.routers');
const { ticketRouter } = require('./ticket.route');
const { userRouter } = require('./user.routers');
const { theaterRouter } = require('./theater.routers');
const { theaterUnitRouter } = require('./theaterUnit.routers');
const { showtimeRouter } = require('./showtime.routers');
const rootRouter = express.Router();

rootRouter.use('/users', userRouter);
rootRouter.use('/auth', authRouter);
rootRouter.use('/ticket', ticketRouter);
rootRouter.use('/movies', movieRouter);
rootRouter.use('/cinemas', cinemaRouter);
rootRouter.use('/theaters', theaterRouter);
rootRouter.use('/theaterUnit', theaterUnitRouter);
rootRouter.use('/showtime', showtimeRouter);
module.exports = {
    rootRouter,
};
