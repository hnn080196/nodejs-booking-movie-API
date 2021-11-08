const Op = require('sequelize').Op;
const { ErrorHandler } = require('../helpers/error');
const { Cinema, Showtime, TheaterUnit, Theater, Movie } = require('../models');

class CinemaController {
    getAll = async (req, res, next) => {
        if (req.query.hasOwnProperty('_search')) {
            const { keyWord } = req.query;
            const searchList = await Cinema.findAll({
                where: {
                    cinemaName: { [Op.like]: '%' + keyWord + '%' },
                    deletedAt: null,
                },
            });
            res.status(200).json({
                data: searchList,
                msg: 'Lấy dữ liệu thành công',
            });
        }
        const cinemaList = await Cinema.findAll({
            where: { deletedAt: null },
        });
        res.status(200).json({
            data: cinemaList,
            msg: 'Lấy dữ liệu thành công',
        });
    };
    getDeletedCinema = async (req, res, next) => {
        if (req.query.hasOwnProperty('_search')) {
            const { keyWord } = req.query;
            const searchList = await Cinema.findAll({
                where: {
                    cinemaName: { [Op.like]: '%' + keyWord + '%' },
                    deletedAt: { [Op.ne]: null },
                },
            });
            res.status(200).json({
                data: searchList,
                msg: 'Lấy dữ liệu thành công',
            });
        }
        const cinemaDeletedList = await Cinema.findAll({
            where: { deletedAt: { [Op.ne]: null } },
            paranoid: false,
        });
        res.status(200).json({
            data: cinemaDeletedList,
            msg: 'Lấy dữ liệu thành công',
        });
    };
    getInfo = async (req, res, next) => {
        const { id } = req.params;
        const cinemaInfo = await Cinema.findByPk(id);
        res.status(200).json({
            data: cinemaInfo,
            msg: 'Lấy Thông Tin Thành Công',
        });
    };

    addNewCinema = async (req, res, next) => {
        const { file } = req;
        if (!file) {
            throw new ErrorHandler(400, 'Vui Lòng Chọn File');
        }
        const urlCinemaLogo = `http://localhost:9000/${file.path}`;
        req.body.cinemaLogo = urlCinemaLogo;
        const newCinema = await Cinema.create(req.body);
        res.status(201).json({ data: newCinema, msg: 'Thêm Rạp Thành Công' });
    };
    update = async (req, res, next) => {
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
        res.status(200).json({ msg: 'Cập nhật Thành công' });
    };
    softDelete = async (req, res, next) => {
        const { id } = req.params;
        //delete Cinema
        const checkShowtime = await Cinema.findAll({
            where: { id, deletedAt: null },
            attributes: ['cinemaName', ['slug', 'cinemaCode'], 'cinemaLogo'],
            include: [
                {
                    model: Theater,
                    required: true,
                    include: {
                        model: TheaterUnit,
                        required: true,
                        include: {
                            model: Showtime,
                            required: true,
                        },
                    },
                },
            ],
        });
        if (checkShowtime.length !== 0) {
            throw new ErrorHandler(400, 'Hệ Thống Rạp Đã Có Lịch Chiếu');
        }
        await Cinema.destroy({
            where: { id },
        });
        res.status(200).json({ message: 'Đã Xóa' });
    };
    forceDelete = async (req, res, next) => {
        const { id } = req.params;
        await Cinema.destroy({
            where: { id },
            force: true,
        });
        res.status(200).send({ msg: 'Đã Xóa Vĩnh Viễn' });
    };
    restoreCinema = async (req, res, next) => {
        const { id } = req.params;
        await Cinema.restore({
            where: { id },
        });
        res.status(200).send({
            msg: 'Khôi phục Cinema thành công!',
        });
    };
}

module.exports = new CinemaController();
