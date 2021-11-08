const { ErrorHandler } = require('../helpers/error');
const {
    Ticket,
    User,
    Seat,
    Showtime,
    Theater,
    TheaterUnit,
} = require('../models');
const asyncForeach = require('../utils/asyncForeach');
class TicketController {
    getTicketByUser = async (req, res, next) => {
        const { userId } = req.params;
        const ticketList = await Ticket.findAll({
            where: {
                userId,
            },
        });
        res.status(200).send({
            message: 'Lấy danh sách vé theo user thành công',
            data: ticketList,
        });
    };

    bookingTicket = async (req, res, next) => {
        const { user } = req;
        const { showtimeId, seatList } = req.body;
        if (!showtimeId) {
            throw new ErrorHandler(404, 'Chưa có lịch chiếu');
        }
        if (seatList.length === 0) {
            throw new ErrorHandler(404, 'Bạn chưa chọn ghế.');
        }
        const isShowtime = await Showtime.findOne({
            where: { id: showtimeId },
        });
        if (!isShowtime) {
            throw new ErrorHandler(404, 'Lịch Chiếu không tồn tại');
        }
        const userInfo = await User.findOne({
            where: { email: user.email },
        });
        const theaterUnitInfo = await TheaterUnit.findOne({
            where: { id: isShowtime.theaterUnitId },
        });

        const theaterInfo = await Theater.findOne({
            where: { id: theaterUnitInfo.theaterId },
        });
        const newTicketList = [];
        await asyncForeach(seatList, async (seat, index) => {
            const seatDB = await Seat.findByPk(seat.seatId);
            if (!seatDB) {
                throw new ErrorHandler(400, 'Ghế Không Tồn Tại');
            } else if (seatDB.showtimeId !== showtimeId) {
                throw new ErrorHandler(
                    400,
                    'Không Tồn Tại Lịch Chiếu cho ghế này'
                );
            }
            const newTicket = await Ticket.create({
                showtimeId: showtimeId,
                userId: userInfo.id,
                seatId: seatDB.id,
                seatName: seatDB.seatName,
                seatType: seatDB.seatType,
                price: seatDB.price,
                theaterUnitName: theaterUnitInfo.theaterUnitName,
                theaterName: theaterInfo.theaterName,
                address: theaterInfo.address,
                bookingUser: userInfo.email,
            });
            await Seat.update(
                { isBooking: true, userBooking: user.email },
                {
                    where: { id: seat.seatId },
                }
            );
            newTicketList.push(newTicket);
        });
        res.status(200).send({
            msg: 'Đặt vé thành công',
            data: newTicketList,
        });
    };
}

module.exports = new TicketController();
