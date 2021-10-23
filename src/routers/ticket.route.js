const express = require('express');
const ticketController = require('../controllers/ticket.controller');

const ticketRouter = express.Router();

ticketRouter.get('/user-by-ticket/:id', ticketController.getUserByTicket);

module.exports = {
    ticketRouter,
};
