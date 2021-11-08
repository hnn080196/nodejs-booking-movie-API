const Op = require('sequelize').Op;
const { ErrorHandler } = require('../helpers/error');
const { TheaterUnit, Theater, Showtime } = require('../models');

class TheaterUnitController {
    getAll = async (req, res, next) => {
        if (req.query.hasOwnProperty('_search')) {
            const { keyWord } = req.query;
            const searchList = await TheaterUnit.findAll({
                where: {
                    theaterUnitName: { [Op.like]: '%' + keyWord + '%' },
                    deletedAt: null,
                },
            });
            res.status(200).json({
                data: searchList,
                msg: 'Lấy thông tin thành công ',
            });
        }
        const theaterUnitList = await TheaterUnit.findAll({
            where: { deletedAt: null },
        });
        res.status(200).json({
            data: theaterUnitList,
            msg: 'Lấy thông tin thành công ',
        });
    };
    getDeletedList = async (req, res, next) => {
        if (req.query.hasOwnProperty('_search')) {
            const { keyWord } = req.query;
            const searchList = await TheaterUnit.findAll({
                where: {
                    theaterUnitName: { [Op.like]: '%' + keyWord + '%' },
                    deletedAt: { [Op.ne]: null },
                },
            });
            res.status(200).json({
                data: searchList,
                msg: 'Lấy thông tin thành công ',
            });
        }
        const theaterUnitDeletedList = await TheaterUnit.findAll({
            where: { deletedAt: { [Op.ne]: null } },
            paranoid: false,
        });
        res.status(200).json({
            data: theaterUnitDeletedList,
            msg: 'Lấy thông tin thành công ',
        });
    };
    getInfo = async (req, res, next) => {
        const { id } = req.params;
        const theaterUnitInfo = await TheaterUnit.findByPk(id);
        res.status(200).json({
            data: theaterUnitInfo,
            msg: 'Lấy thông tin thành công ',
        });
    };
    addNew = async (req, res, next) => {
        const { theaterSlug } = req.params;
        const findTheater = await Theater.findOne({
            where: {
                slug: theaterSlug,
            },
        });
        if (!findTheater) {
            throw new ErrorHandler(404, 'Hệ Thống Rạp Không Tồn Tại');
        }
        req.body.theaterId = findTheater.id;
        await TheaterUnit.create(req.body);
        res.status(200).json({ msg: 'Tạo Cụm Rạp Thành Công' });
    };
    update = async (req, res, next) => {
        const { id } = req.params;
        if (req.body.theaterId) {
            throw new ErrorHandler(400, 'Bạn Không được thay đổi trường này.');
        }
        const updates = Object.keys(req.body);
        const theaterUnitUpdate = await TheaterUnit.findByPk(id);
        updates.forEach((update) => {
            if (!(update in theaterUnitUpdate)) {
                throw new ErrorHandler(400, `trường ${update} không tồn tại`);
            }
            theaterUnitUpdate[update] = req.body[update];
        });
        await theaterUnitUpdate.save();
        res.status(200).json({ msg: 'Cập nhật Thành công' });
    };
    softDelete = async (req, res, next) => {
        const { id } = req.params;
        const findShowtime = Showtime.findOne({
            where: {
                theaterUnitId: id,
            },
        });
        if (findShowtime) {
            throw new ErrorHandler(400, 'Rạp Đã Có Lịch Chiếu Không Thể Xóa!');
        }
        await TheaterUnit.destroy({
            where: { id },
        });
        res.status(200).json({ msg: 'Đã Xóa' });
    };
    forceDelete = async (req, res, next) => {
        const { id } = req.params;
        await TheaterUnit.destroy({
            where: { id },
            force: true,
        });
        res.status(200).json({ msg: 'Đã Xóa Vĩnh Viễn' });
    };
    restore = async (req, res, next) => {
        const { id } = req.params;
        await TheaterUnit.restore({
            where: { id },
        });
        res.status(200).json({
            msg: 'Khôi phục Rạp thành công!',
        });
    };
}

module.exports = new TheaterUnitController();
