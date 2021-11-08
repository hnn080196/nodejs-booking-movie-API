const express = require('express');
const { User } = require('../models');
const ticketController = require('../controllers/ticket.controller');
const {
    authenticate,
} = require('../middlewares/auth/verify-token.middlewares');
const {
    checkExist,
} = require('../middlewares/validations/check-exist.middlewares');
const { asyncMiddleware } = require('../utils/asyncMiddleware');
const ticketRouter = express.Router();

ticketRouter.get(
    '/ticket-by-user/:userId',
    authenticate,
    checkExist(User),
    asyncMiddleware(ticketController.getTicketByUser)
);
ticketRouter.post(
    '/booking-ticket',
    authenticate,
    asyncMiddleware(ticketController.bookingTicket)
);

module.exports = {
    ticketRouter,
};
