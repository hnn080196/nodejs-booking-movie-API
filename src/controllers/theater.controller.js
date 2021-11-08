const Op = require('sequelize').Op;
const { ErrorHandler } = require('../helpers/error');
const { Theater, Cinema, TheaterUnit } = require('../models');
const asyncForeach = require('../utils/asyncForeach');
class theaterController {
    getAll = async (req, res, next) => {
        if (req.query.hasOwnProperty('_search')) {
            const { keyWord } = req.query;
            const searchList = await Theater.findAll({
                where: {
                    theaterName: { [Op.like]: '%' + keyWord + '%' },
                    deletedAt: null,
                },
            });
            res.status(200).json({
                data: searchList,
                msg: ' Lấy Dữ Liệu Thành Công',
            });
        }
        const theaterList = await Theater.findAll({
            where: { deletedAt: null },
        });
        res.status(200).json({
            data: theaterList,
            msg: ' Lấy Dữ Liệu Thành Công',
        });
    };
    getTheaterByCinema = async (req, res, next) => {
        const { cinemaSlug } = req.params;

        const findCinema = await Cinema.findOne({
            where: { slug: cinemaSlug, deletedAt: null },
        });
        if (!findCinema) {
            throw new ErrorHandler(404, 'Không tìm thấy hệ thông rạp');
        }
        if (req.query.hasOwnProperty('_search')) {
            const { keyWord } = req.query;
            const searchList = await Theater.findAll({
                where: {
                    deletedAt: null,
                    cinemaId: findCinema.id,
                    theaterName: { [Op.like]: '%' + keyWord + '%' },
                },
                attributes: ['id', 'theaterName', 'address', 'slug'],
                include: {
                    model: TheaterUnit,
                    required: false,
                    attributes: [
                        ['id', 'theaterUnitId'],
                        'theaterUnitName',
                        ['slug', 'theaterUnitSlug'],
                    ],
                },
            });
            res.status(200).json({
                data: searchList,
                msg: ' Lấy Dữ Liệu Thành Công',
            });
        }
        const theaterListByCinema = await Theater.findAll({
            where: { deletedAt: null, cinemaId: findCinema.id },
            attributes: ['id', 'theaterName', 'address', 'slug'],
            include: {
                model: TheaterUnit,
                required: false,
                attributes: [
                    ['id', 'theaterUnitId'],
                    'theaterUnitName',
                    ['slug', 'theaterUnitSlug'],
                ],
            },
        });

        res.status(200).json({
            data: theaterListByCinema,
            msg: ' Lấy Dữ Liệu Thành Công',
        });
    };
    getDeletedList = async (req, res, next) => {
        if (req.query.hasOwnProperty('_search')) {
            const { keyWord } = req.query;
            const searchList = await Theater.findAll({
                where: {
                    theaterName: { [Op.like]: '%' + keyWord + '%' },
                    deletedAt: { [Op.ne]: null },
                },
            });
            res.status(200).json({
                data: searchList,
                msg: ' Lấy Dữ Liệu Thành Công',
            });
        }
        const theaterDeletedList = await Theater.findAll({
            where: { deletedAt: { [Op.ne]: null } },
            paranoid: false,
        });
        res.status(200).json({
            data: theaterDeletedList,
            msg: ' Lấy Dữ Liệu Thành Công',
        });
    };
    getInfo = async (req, res, next) => {
        const { id } = req.params;
        const theaterInfo = await Theater.findByPk(id);
        res.status(200).json({
            data: theaterInfo,
            msg: ' Lấy Dữ Liệu Thành Công',
        });
    };

    addNew = async (req, res, next) => {
        const { cinemaSlug } = req.params;
        const findCinema = await Cinema.findOne({
            where: {
                slug: cinemaSlug,
            },
        });
        if (!findCinema) {
            throw new ErrorHandler(404, 'Hệ Thống Rạp Không Tồn Tại');
        }
        req.body.cinemaId = findCinema.id;
        const newTheater = await Theater.create(req.body);

        const theaterUnitArray = Array.from(new Array(10));
        try {
            await asyncForeach(theaterUnitArray, async (theaterUnit, index) => {
                await TheaterUnit.create({
                    theaterId: newTheater.id,
                    theaterUnitName: `Rạp ${index + 1}`,
                });
            });
        } catch (error) {
            next(error);
        }
        res.status(200).json({ msg: 'Tạo Cụm Rạp Thành Công' });
    };
    update = async (req, res, next) => {
        const { id } = req.params;
        if (req.body.cinemaId) {
            throw new ErrorHandler(400, 'Bạn Không được thay đổi trường này.');
        }
        const updates = Object.keys(req.body);
        const theaterUpdate = await Theater.findByPk(id);
        updates.forEach((update) => {
            if (!(update in theaterUpdate)) {
                throw new ErrorHandler(400, `trường ${update} không tồn tại`);
            }
            theaterUpdate[update] = req.body[update];
        });
        await theaterUpdate.save();
        res.status(200).json({ msg: 'Cập Nhật Cụm Rạp Thành Công' });
    };
    softDelete = async (req, res, next) => {
        const { id } = req.params;
        const checkShowtime = await Theater.findAll({
            where: { id, deletedAt: null },
            include: [
                {
                    model: TheaterUnit,
                    required: true,
                    include: {
                        model: Showtime,
                        required: true,
                    },
                },
            ],
        });
        if (checkShowtime.length !== 0) {
            throw new ErrorHandler(400, 'Tồn Tại Lịch Chiếu không thể xóa');
        }
        await Theater.destroy({
            where: { id },
        });
        res.status(200).send({ msg: 'Đã Xóa' });
    };
    forceDelete = async (req, res, next) => {
        const { id } = req.params;
        await Theater.destroy({
            where: { id },
            force: true,
        });
        res.status(200).send({ msg: 'Đã Xóa Vĩnh Viễn' });
    };
    restore = async (req, res, next) => {
        const { id } = req.params;
        await Theater.restore({
            where: { id },
        });
        res.status(200).send({
            msg: 'Khôi phục Rạp thành công!',
        });
    };
}

module.exports = new theaterController();
