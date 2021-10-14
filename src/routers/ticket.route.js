const express = require("express");
const { getUserByTicket } = require("../controllers/ticket.controller");

const ticketRouter = express.Router();

ticketRouter.get("/user-by-ticket/:id", getUserByTicket);

module.exports = {
  ticketRouter,
};
