const express = require('express');
const { User } = require('../models');
const ticketController = require('../controllers/ticket.controller');
const {
    authenticate,
} = require('../middlewares/auth/verify-token.middlewares');
const {
    checkExist,
} = require('../middlewares/validations/check-exist.middlewares');

const ticketRouter = express.Router();

ticketRouter.get(
    '/ticket-by-user/:userId',
    authenticate,
    checkExist(User),
    ticketController.getTicketByUser
);
ticketRouter.post(
    '/booking-ticket',
    authenticate,
    ticketController.bookingTicket
);

module.exports = {
    ticketRouter,
};
