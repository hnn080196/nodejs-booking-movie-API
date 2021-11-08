const { Movie, Showtime, Cinema, Movie_Cinema } = require('../models');

const Op = require('sequelize').Op;
const { ErrorHandler } = require('../helpers/error');

class MovieController {
    // get all movie (done) /?_search&keyWord=value
    getAll = async (req, res, next) => {
        if (req.query.hasOwnProperty('_search')) {
            const { keyWord } = req.query;
            const searchList = await Movie.findAll({
                where: {
                    slug: { [Op.like]: '%' + keyWord + '%' },
                    deletedAt: null,
                },
            });
            res.status(200).json({
                data: searchList,
                msg: 'Lấy dữ liệu thành công',
            });
        }
        const movieList = await Movie.findAll({
            where: { deletedAt: null },
        });
        res.status(200).json({
            data: movieList,
            msg: 'Lấy dữ liệu thành công',
        });
    };
    getMoviePagination = async (req, res, next) => {
        const { keyWord, page, perPage } = req.query;
        if (page > 0 && perPage > 0) {
            const pagination = await Movie.findAndCountAll({
                where: {
                    slug: { [Op.like]: '%' + keyWord + '%' },
                    deletedAt: null,
                },
                limit: +perPage,
                offset: page === 1 ? 0 : perPage * (page - 1),
            });

            res.status(200).json({
                data: pagination,
                msg: 'Lấy Dữ Liệu Thành Công',
            });
        } else {
            throw new ErrorHandler(400, 'Bad Request ');
        }
    };
    getDeletedList = async (req, res, next) => {
        const deletedMovieList = await Movie.findAll({
            where: {
                deletedAt: { [Op.ne]: null },
            },
            paranoid: false,
        });
        res.status(201).json(deletedMovieList);
    };
    addCinemaToMovie = async (req, res, next) => {
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
        res.status(200).json({
            msg: `Thêm hệ thống rạp ${cinema.cinemaName} chiếu phim ${movie.movieName}`,
            data: MovieCinema,
        });
    };
    // get info movie (done)
    getInfo = async (req, res) => {
        const { id } = req.params;
        const movieDetail = await Movie.findByPk(id);
        res.status(200).send(movieDetail);
    };
    addNew = async (req, res, next) => {
        const { file } = req;
        if (!file) {
            throw new ErrorHandler(400, 'Vui Lòng Chọn File');
        }
        const urlPoster = `http://localhost:9000/${file.path}`;
        req.body.poster = urlPoster;
        const newMovie = await Movie.create(req.body);
        res.status(201).json(newMovie);
    };

    update = async (req, res, next) => {
        const { id } = req.params;
        const { file } = req;
        if (file) {
            const urlPoster = `http://localhost:9000/${file.path}`;
            req.body.poster = urlPoster;
        }
        const updates = Object.keys(req.body);
        const movieUpdate = await Movie.findByPk(id);
        updates.forEach((update) => (movieUpdate[update] = req.body[update]));
        await movieUpdate.save();
        res.status(200).json(movieUpdate);
    };

    softDelete = async (req, res, next) => {
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
        res.status(200).json({ msg: 'Đã Xóa Phim!!' });
    };

    forceDelete = async (req, res, next) => {
        const { id } = req.params;
        await Movie.destroy({
            where: {
                id,
            },
            force: true,
        });
        res.status(200).json({ msg: 'Đã Xóa Vĩnh Viễn!!' });
    };
    restoreMovie = async (req, res, next) => {
        const { id } = req.params;
        await Movie.restore({
            where: { id },
        });
        res.status(200).json({
            msg: 'Khôi Phục Thành Công!',
        });
    };
}
module.exports = new MovieController();
