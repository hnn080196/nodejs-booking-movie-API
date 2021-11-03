const Op = require('sequelize').Op;
const { ErrorHandler } = require('../helpers/error');
const {
    TheaterUnit,
    Showtime,
    Movie,
    Seat,
    Cinema,
    Theater,
    Movie_Cinema,
} = require('../models');
const asyncForeach = require('../utils/asyncForeach');

class ShowtimeController {
    getAll = async (req, res, next) => {
        try {
            const showtimeList = await Showtime.findAll({
                where: { deletedAt: null },
            });
            res.status(200).json(showtimeList);
        } catch (error) {
            next(new ErrorHandler(500, 'Lỗi Máy Chủ'));
        }
    };
    getShowtimeByMovieId = async (req, res, next) => {
        try {
            const { movieId } = req.params;

            const MovieCinema = await Movie.findOne({
                where: { deletedAt: null, id: movieId },
                attributes: [
                    'id',
                    'movieName',
                    'trailer',
                    'poster',
                    'description',
                    'releaseDate',
                    'rating',
                    ['slug', 'movieSlug'],
                ],
                include: {
                    model: Cinema,
                    as: 'cinemas',
                    attributes: [
                        'cinemaName',
                        ['slug', 'cinemaCode'],
                        'cinemaLogo',
                    ],
                    include: [
                        {
                            model: Theater,
                            required: true,
                            attributes: [
                                'id',
                                'theaterName',
                                'address',
                                ['slug', 'theaterSlug'],
                            ],
                            include: [
                                {
                                    model: TheaterUnit,
                                    required: true,
                                    attributes: [
                                        'id',
                                        'theaterUnitName',
                                        ['slug', 'theaterSlug'],
                                    ],
                                },
                                {
                                    model: TheaterUnit,
                                    include: {
                                        model: Showtime,
                                        required: true,
                                        attributes: ['id', 'showtime', 'price'],
                                        where: { movieId },
                                    },
                                },
                            ],
                        },
                    ],
                    // chặn model trung gian
                    through: {
                        attributes: [],
                    },
                },
            });
            res.status(200).json(MovieCinema);
        } catch (error) {
            next(error);
        }
    };
    getShowtimeByCinema = async (req, res, next) => {
        try {
            const { cinemaSlug } = req.params;
            const isCinemaExist = await Cinema.findOne({
                where: { slug: cinemaSlug, deletedAt: null },
            });
            if (!isCinemaExist) {
                throw new ErrorHandler(404, 'Mã Hệ Thống Rạp Không Tồn Tại');
            }
            const showtimeListByCinema = await Cinema.findAll({
                where: { slug: cinemaSlug, deletedAt: null },
                attributes: [
                    'cinemaName',
                    ['slug', 'cinemaCode'],
                    'cinemaLogo',
                ],
                include: [
                    {
                        model: Theater,
                        required: true,
                        attributes: [
                            'id',
                            'theaterName',
                            'address',
                            ['slug', 'theaterSlug'],
                        ],
                        include: {
                            model: TheaterUnit,
                            required: true,
                            attributes: [
                                'id',
                                'theaterUnitName',
                                ['slug', 'theaterSlug'],
                            ],
                            include: {
                                model: Showtime,
                                required: true,
                                attributes: ['id', 'showtime', 'price'],
                                include: {
                                    model: Movie,
                                    attributes: [
                                        'id',
                                        'movieName',
                                        'trailer',
                                        'poster',
                                        'description',
                                        'releaseDate',
                                        'rating',
                                        ['slug', 'movieSlug'],
                                    ],
                                },
                            },
                        },
                    },
                ],
            });
            res.status(200).send(showtimeListByCinema);
        } catch (error) {
            next(error);
        }
    };
    getSeatListByShowtime = async (req, res, next) => {
        try {
            const { id } = req.params;
            const seatList = await Seat.findAll({
                where: { showtimeId: id },
            });
            res.status(200).send(seatList);
        } catch (error) {
            next(error);
        }
    };
    getDeletedList = async (req, res, next) => {
        try {
            const showtimeDeletedList = await Showtime.findAll({
                where: { deletedAt: { [Op.ne]: null } },
                paranoid: false,
            });
            res.status(200).json(showtimeDeletedList);
        } catch (error) {
            next(new ErrorHandler(500, 'Lỗi Máy Chủ'));
        }
    };
    getInfo = async (req, res, next) => {
        try {
            const { id } = req.params;
            const showtimeInfo = await Showtime.findByPk(id);
            res.status(200).json(showtimeInfo);
        } catch (error) {
            next(new ErrorHandler(500, 'Lỗi Máy Chủ'));
        }
    };

    addNew = async (req, res, next) => {
        try {
            const { movieId, theaterUnitId, showtime } = req.body;
            const findMovie = await Movie.findOne({
                where: {
                    id: movieId,
                },
            });
            const findTheaterUnit = await TheaterUnit.findOne({
                where: {
                    id: theaterUnitId,
                },
            });
            const isHasShowtime = await Showtime.findOne({
                where: {
                    movieId,
                    theaterUnitId,
                    showtime,
                },
            });
            if (!findMovie) {
                throw new ErrorHandler(404, 'Phim Không Tồn Tại');
            }
            if (!findTheaterUnit) {
                throw new ErrorHandler(404, 'Hệ Thống Rạp Không Tồn Tại');
            }
            if (isHasShowtime) {
                throw new ErrorHandler(404, 'Lịch Chiếu Đã Tồn Tại');
            }
            const newShowtime = await Showtime.create(req.body);

            try {
                const seatObject = {
                    showtimeId: newShowtime.id,
                    seatName: '', // = index
                    seatType: 'normal', //normal or vip
                    price: newShowtime.price,
                    isBooking: false,
                    userBooking: '',
                };
                const seatsArray = Array.from(new Array(80));
                await asyncForeach(seatsArray, async (seat, index) => {
                    seatObject.seatName = index + 1;
                    if (index <= 20) {
                        seatObject.seatType = 'vip';
                    } else {
                        seatObject.seatType = 'normal';
                    }
                    await Seat.create(seatObject);
                });
            } catch (error) {
                next(error);
            }
            res.status(200).send('Tạo Cụm Rạp Thành Công');
        } catch (error) {
            next(error);
        }
    };
    softDelete = async (req, res, next) => {
        try {
            const { id } = req.params;
            await Seat.destroy({
                where: {
                    showtimeId: id,
                },
            });
            await Showtime.destroy({
                where: { id },
            });
            res.status(200).send({ message: 'Đã Xóa' });
        } catch (error) {
            next(new ErrorHandler(500, 'Lỗi Máy Chủ'));
        }
    };
    forceDelete = async (req, res, next) => {
        try {
            const { id } = req.params;
            await Seat.destroy({
                where: {
                    showtimeId: id,
                },
                force: true,
            });
            await Showtime.destroy({
                where: { id },
                force: true,
            });
            res.status(200).send({ message: 'Đã Xóa Vĩnh Viễn' });
        } catch (error) {
            next(new ErrorHandler(500, 'Lỗi Máy Chủ'));
        }
    };
    restore = async (req, res, next) => {
        try {
            const { id } = req.params;
            await Seat.restore({
                where: { showtimeId: id },
            });
            await Showtime.restore({
                where: { id },
            });
            res.status(200).send({
                message: 'Khôi phục lịch chiếu thành công!',
            });
        } catch (error) {
            next(new ErrorHandler(500, 'Lỗi Máy Chủ'));
        }
    };
}

module.exports = new ShowtimeController();
