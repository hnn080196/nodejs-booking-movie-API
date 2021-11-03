const { Movie, Showtime, Cinema, Movie_Cinema } = require('../models');
const { sequelize } = require('../models');
const Op = require('sequelize').Op;
const { ErrorHandler } = require('../helpers/error');

class MovieController {
    // get all movie (done) /?_search&keyWord=value
    getAll = async (req, res, next) => {
        try {
            if (req.query.hasOwnProperty('_search')) {
                const { keyWord } = req.query;
                const searchList = await Movie.findAll({
                    where: {
                        slug: { [Op.like]: '%' + keyWord + '%' },
                        deletedAt: null,
                    },
                });
                res.status(200).send(searchList);
            }
            const movieList = await Movie.findAll({
                where: { deletedAt: null },
            });
            res.status(200).send(movieList);
        } catch (error) {
            next(new ErrorHandler(500, 'Lỗi Máy Chủ'));
        }
    };
    getDeletedList = async (req, res, next) => {
        try {
            const deletedMovieList = await Movie.findAll({
                where: {
                    deletedAt: { [Op.ne]: null },
                },
                paranoid: false,
            });
            res.status(201).json(deletedMovieList);
        } catch (error) {
            next(new ErrorHandler(500, 'Lỗi Máy Chủ'));
        }
    };
    addCinemaToMovie = async (req, res, next) => {
        try {
            const { movieId, cinemaId } = req.body;
            if (!movieId) {
                throw new ErrorHandler(404, 'Nhập Mã Phim');
            }
            if (!cinemaId) {
                throw new ErrorHandler(404, 'Nhập mã hệ thống rạp');
            }
            const movie = await Movie.findByPk(movieId);
            const cinema = await Cinema.findByPk(cinemaId);
            if (!movie || !cinema) {
                throw new ErrorHandler(404, 'Phim hoặc Rạp không tồn tại');
            }
            const MovieCinema = await movie.addCinema(cinema);
            res.status(200).send(MovieCinema);
        } catch (error) {
            next(error);
        }
    };
    // get info movie (done)
    getInfo = async (req, res) => {
        try {
            const { id } = req.params;
            const movieDetail = await Movie.findByPk(id);
            res.status(200).send(movieDetail);
        } catch (error) {
            next(new ErrorHandler(500, 'Lỗi Máy Chủ'));
        }
    };
    addNew = async (req, res, next) => {
        try {
            const { file } = req;
            if (!file) {
                throw new ErrorHandler(400, 'Vui Lòng Chọn File');
            }
            const urlPoster = `http://localhost:9000/${file.path}`;
            req.body.poster = urlPoster;
            const newMovie = await Movie.create(req.body);
            res.status(201).json(newMovie);
        } catch (error) {
            next(error);
        }
    };

    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { file } = req;
            if (file) {
                const urlPoster = `http://localhost:9000/${file.path}`;
                req.body.poster = urlPoster;
            }
            const updates = Object.keys(req.body);
            const movieUpdate = await Movie.findByPk(id);
            updates.forEach(
                (update) => (movieUpdate[update] = req.body[update])
            );
            await movieUpdate.save();
            res.status(200).json(movieUpdate);
        } catch (error) {
            next(new ErrorHandler(500, 'Lỗi Máy Chủ'));
        }
    };

    softDelete = async (req, res, next) => {
        try {
            const { id } = req.params;
            const checkShowtime = await Movie.findOne({
                include: [
                    {
                        model: Showtime,
                        where: { movieId: id },
                    },
                ],
            });
            if (checkShowtime) {
                throw new ErrorHandler(400, 'Phim Đã Có Lịch Chiếu!');
            }
            await Movie.destroy({
                where: {
                    id,
                },
            });
            res.status(200).send('Đã Xóa Phim!!');
        } catch (error) {
            next(error);
        }
    };

    forceDelete = async (req, res, next) => {
        try {
            const { id } = req.params;
            await Movie.destroy({
                where: {
                    id,
                },
                force: true,
            });
            res.status(200).send('Đã Xóa Vĩnh Viễn!!');
        } catch (error) {
            next(new ErrorHandler(500, 'Lỗi Máy Chủ'));
        }
    };
    restoreMovie = async (req, res, next) => {
        try {
            const { id } = req.params;
            await Movie.restore({
                where: { id },
            });
            res.status(200).send({
                message: 'Khôi Phục Thành Công!',
            });
        } catch (error) {
            next(new ErrorHandler(500, 'Lỗi Máy Chủ'));
        }
    };
}
module.exports = new MovieController();
