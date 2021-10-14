const { Ticket, User, Movie } = require("../models");
const getUserByTicket = async (req, res) => {
  const { id } = req.params;
  const ticketDetail = await Ticket.findOne({
    where: {
      id,
    },
    include: [
      {
        model: User,
      },
    ],
  });
  res.send(ticketDetail);
};

module.exports = {
  getUserByTicket,
};
