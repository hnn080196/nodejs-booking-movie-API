const { Ticket, User, Movie } = require('../models');
class TicketController {
    getUserByTicket = async (req, res) => {
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
}

module.exports = new TicketController();
