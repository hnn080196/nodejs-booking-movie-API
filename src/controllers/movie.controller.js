const { Movie } = require('../models');
const { sequelize } = require('../models');

class MovieController {
    // get all movie (done)
    getAll = async (req, res) => {
        try {
            const movieList = await Movie.findAll();
            res.status(200).send(movieList);
        } catch (error) {
            res.status(500).send({
                message: 'Lỗi Server',
            });
        }
    };
    // get info movie (done)
    getInfo = async (req, res) => {
        try {
            const { id } = req.params;
            const movieDetail = await Movie.findByPk(id);
            res.status(200).send(movieDetail);
        } catch (error) {
            res.status(500).send({
                message: 'Lỗi Server',
            });
        }
    };
    addNew = async (req, res, next) => {
        try {
            const { file } = req;
            const urlPoster = `http://localhost:9000/${file.path}`;
            if (!file) {
                const error = new Error('Vui Lòng Chọn File');
                error.httpStatusCode = 400;
                return next(error);
            }
            req.body.poster = urlPoster;
            const newMovie = await Movie.create(req.body);
            res.status(201).send(newMovie);
        } catch (error) {
            res.status(500).send({
                message: 'Lỗi Server',
                error,
            });
        }
    };

    update = async (req, res) => {
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
            res.status(200).send(movieUpdate);
        } catch (error) {
            res.status(500).send({
                message: 'Lỗi Server',
            });
        }
    };

    delete = async (req, res) => {
        try {
            const { id } = req.params;
            const { detailInfo } = req;
            await Movie.destroy({
                where: {
                    id,
                },
            });
            res.status(200).send(detailInfo);
        } catch (error) {
            res.status(500).send({
                message: 'Lỗi Server',
            });
        }
    };
}
module.exports = new MovieController();
