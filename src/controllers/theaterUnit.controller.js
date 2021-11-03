const Op = require('sequelize').Op;
const { ErrorHandler } = require('../helpers/error');
const { TheaterUnit, Theater, Showtime } = require('../models');

class TheaterUnitController {
    getAll = async (req, res, next) => {
        try {
            if (req.query.hasOwnProperty('_search')) {
                const { keyWord } = req.query;
                const searchList = await TheaterUnit.findAll({
                    where: {
                        theaterUnitName: { [Op.like]: '%' + keyWord + '%' },
                        deletedAt: null,
                    },
                });
                res.status(200).json(searchList);
            }
            const theaterUnitList = await TheaterUnit.findAll({
                where: { deletedAt: null },
            });
            res.status(200).json(theaterUnitList);
        } catch (error) {
            next(error);
        }
    };
    getDeletedList = async (req, res, next) => {
        try {
            if (req.query.hasOwnProperty('_search')) {
                const { keyWord } = req.query;
                const searchList = await TheaterUnit.findAll({
                    where: {
                        theaterUnitName: { [Op.like]: '%' + keyWord + '%' },
                        deletedAt: { [Op.ne]: null },
                    },
                });
                res.status(200).json(searchList);
            }
            const theaterUnitDeletedList = await TheaterUnit.findAll({
                where: { deletedAt: { [Op.ne]: null } },
                paranoid: false,
            });
            res.status(200).json(theaterUnitDeletedList);
        } catch (error) {
            next(error);
        }
    };
    getInfo = async (req, res, next) => {
        try {
            const { id } = req.params;
            const theaterUnitInfo = await TheaterUnit.findByPk(id);
            res.status(200).json(theaterUnitInfo);
        } catch (error) {
            next(error);
        }
    };
    addNew = async (req, res, next) => {
        try {
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
            res.status(200).send('Tạo Cụm Rạp Thành Công');
        } catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (req.body.theaterId) {
                throw new ErrorHandler(
                    400,
                    'Bạn Không được thay đổi trường này.'
                );
            }
            const updates = Object.keys(req.body);
            const theaterUnitUpdate = await TheaterUnit.findByPk(id);
            updates.forEach((update) => {
                if (!(update in theaterUnitUpdate)) {
                    throw new ErrorHandler(
                        400,
                        `trường ${update} không tồn tại`
                    );
                }
                theaterUnitUpdate[update] = req.body[update];
            });
            await theaterUnitUpdate.save();
            res.status(200).json('Cập nhật Thành công');
        } catch (error) {
            next(error);
        }
    };
    softDelete = async (req, res, next) => {
        try {
            const { id } = req.params;
            const findShowtime = Showtime.findOne({
                where: {
                    theaterUnitId: id,
                },
            });
            if (findShowtime) {
                throw new ErrorHandler(
                    400,
                    'Rạp Đã Có Lịch Chiếu Không Thể Xóa!'
                );
            }
            await TheaterUnit.destroy({
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
            await TheaterUnit.destroy({
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
            await TheaterUnit.restore({
                where: { id },
            });
            res.status(200).send({
                message: 'Khôi phục Rạp thành công!',
            });
        } catch (error) {
            next(new ErrorHandler(500, 'Lỗi Máy Chủ'));
        }
    };
}

module.exports = new TheaterUnitController();
