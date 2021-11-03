const Op = require('sequelize').Op;
const { ErrorHandler } = require('../helpers/error');
const { Cinema, Showtime, TheaterUnit, Theater } = require('../models');

class CinemaController {
    getAll = async (req, res, next) => {
        try {
            if (req.query.hasOwnProperty('_search')) {
                const { keyWord } = req.query;
                const searchList = await Cinema.findAll({
                    where: {
                        cinemaName: { [Op.like]: '%' + keyWord + '%' },
                        deletedAt: null,
                    },
                });
                res.status(200).json(searchList);
            }
            const cinemaList = await Cinema.findAll({
                where: { deletedAt: null },
            });
            res.status(200).json(cinemaList);
        } catch (error) {
            next(error);
        }
    };
    getDeletedCinema = async (req, res, next) => {
        try {
            if (req.query.hasOwnProperty('_search')) {
                const { keyWord } = req.query;
                const searchList = await Cinema.findAll({
                    where: {
                        cinemaName: { [Op.like]: '%' + keyWord + '%' },
                        deletedAt: { [Op.ne]: null },
                    },
                });
                res.status(200).json(searchList);
            }
            const cinemaDeletedList = await Cinema.findAll({
                where: { deletedAt: { [Op.ne]: null } },
                paranoid: false,
            });
            res.status(200).json(cinemaDeletedList);
        } catch (error) {
            next(error);
        }
    };
    getInfo = async (req, res, next) => {
        try {
            const { id } = req.params;
            const cinemaInfo = await Cinema.findByPk(id);
            res.status(200).json(cinemaInfo);
        } catch (error) {
            next(error);
        }
    };

    addNewCinema = async (req, res, next) => {
        try {
            const { file } = req;
            if (!file) {
                throw new ErrorHandler(400, 'Vui Lòng Chọn File');
            }
            const urlCinemaLogo = `http://localhost:9000/${file.path}`;
            req.body.cinemaLogo = urlCinemaLogo;
            const newCinema = await Cinema.create(req.body);
            res.status(201).send(newCinema);
        } catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { file } = req;
            if (file) {
                const urlCinemaLogo = `http://localhost:9000/${file.path}`;
                req.body.cinemaLogo = urlCinemaLogo;
            }
            const updates = Object.keys(req.body);
            const cinemaUpdate = await Cinema.findByPk(id);
            updates.forEach((update) => {
                if (!(update in cinemaUpdate)) {
                    throw new ErrorHandler(400, `Không có trường ${update}`);
                }
                cinemaUpdate[update] = req.body[update];
            });
            await cinemaUpdate.save();
            res.status(200).json('Cập nhật Thành công');
        } catch (error) {
            next(error);
        }
    };
    softDelete = async (req, res, next) => {
        try {
            const { id } = req.params;

            //delete Cinema
            await Cinema.destroy({
                where: { id },
            });
            res.status(200).send({ message: 'Đã Xóa' });
        } catch (error) {
            next(error);
        }
    };
    forceDelete = async (req, res, next) => {
        try {
            const { id } = req.params;
            await Cinema.destroy({
                where: { id },
                force: true,
            });
            res.status(200).send({ message: 'Đã Xóa Vĩnh Viễn' });
        } catch (error) {
            next(new ErrorHandler(500, 'Lỗi Máy Chủ'));
        }
    };
    restoreCinema = async (req, res, next) => {
        try {
            const { id } = req.params;
            await Cinema.restore({
                where: { id },
            });
            res.status(200).send({
                message: 'Khôi phục Cinema thành công!',
            });
        } catch (error) {
            next(new ErrorHandler(500, 'Lỗi Máy Chủ'));
        }
    };
}

module.exports = new CinemaController();
