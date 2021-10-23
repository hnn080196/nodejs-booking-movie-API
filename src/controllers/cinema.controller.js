const { Cinema } = require('../models');

class CinemaController {
    getAll = async (req, res, next) => {
        try {
            const cinemaList = await Cinema.findAll();
            res.status(200).json(cinemaList);
        } catch (error) {
            res.status(500).send({
                message: 'Lỗi Server',
            });
        }
    };
    getInfo = async (req, res, next) => {
        try {
            const { id } = req.params;
            const cinemaInfo = Cinema.findByPk(id);
            res.status(200).json(cinemaInfo);
        } catch (error) {
            res.status(500).send({ message: 'Lỗi Server', error });
        }
    };

    addNew = async (req, res, next) => {
        try {
            const { file } = req;
            const urlCinemaLogo = `http://localhost:9000/${file.path}`;
            if (!file) {
                const error = new Error('Vui Lòng Chọn File');
                error.httpStatusCode = 400;
                return next(error);
            }
            req.body.cinemaLogo = urlCinemaLogo;
            const newCinema = Cinema.create(req.body);
            res.status(200).json(newCinema);
        } catch (error) {
            res.status(500).send({
                message: 'Lỗi Server',
                error,
            });
        }
    };

    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { file } = req;
            const urlCinemaLogo = `http://localhost:9000/${file.path}`;
            if (!file) {
                const error = new Error('Vui Lòng Chọn File');
                error.httpStatusCode = 400;
                return next(error);
            }
            req.body.cinemaLogo = urlCinemaLogo;
            const updates = Object.keys(req.body);
            const cinemaUpdate = Cinema.findByPk(id);
            updates.forEach(
                (update) => (cinemaUpdate[update] = req.body[update])
            );
            await cinemaUpdate.save();
            res.status(200).json(cinemaUpdate);
        } catch (error) {
            res.status(500).send({
                message: 'Lỗi Server',
            });
        }
    };

    delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { detailInfo } = req;
            await Cinema.destroy({
                where: { id },
            });
            res.status(200).send({message :'Xoa Thanh Cong '})
        } catch (error) {
            res.status(500).send({
                message: 'Lỗi Server',
            });
        }
    };
}

module.exports = new CinemaController();
