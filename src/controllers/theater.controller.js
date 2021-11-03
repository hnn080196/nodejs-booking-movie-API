const Op = require('sequelize').Op;
const { ErrorHandler } = require('../helpers/error');
const { Theater, Cinema, TheaterUnit } = require('../models');
const asyncForeach = require('../utils/asyncForeach');
class theaterController {
    getAll = async (req, res, next) => {
        try {
            if (req.query.hasOwnProperty('_search')) {
                const { keyWord } = req.query;
                const searchList = await Theater.findAll({
                    where: {
                        theaterName: { [Op.like]: '%' + keyWord + '%' },
                        deletedAt: null,
                    },
                });
                res.status(200).json(searchList);
            }
            const theaterList = await Theater.findAll({
                where: { deletedAt: null },
            });
            res.status(200).json(theaterList);
        } catch (error) {
            next(error);
        }
    };
    getTheaterByCinema = async (req, res, next) => {
        try {
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
                res.status(200).json(searchList);
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

            res.status(200).json(theaterListByCinema);
        } catch (error) {
            next(error);
        }
    };
    getDeletedList = async (req, res, next) => {
        try {
            if (req.query.hasOwnProperty('_search')) {
                const { keyWord } = req.query;
                const searchList = await Theater.findAll({
                    where: {
                        theaterName: { [Op.like]: '%' + keyWord + '%' },
                        deletedAt: { [Op.ne]: null },
                    },
                });
                res.status(200).json(searchList);
            }
            const theaterDeletedList = await Theater.findAll({
                where: { deletedAt: { [Op.ne]: null } },
                paranoid: false,
            });
            res.status(200).json(theaterDeletedList);
        } catch (error) {
            next(error);
        }
    };
    getInfo = async (req, res, next) => {
        try {
            const { id } = req.params;
            const theaterInfo = await Theater.findByPk(id);
            res.status(200).json(theaterInfo);
        } catch (error) {
            next(error);
        }
    };

    addNew = async (req, res, next) => {
        try {
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
                await asyncForeach(
                    theaterUnitArray,
                    async (theaterUnit, index) => {
                        await TheaterUnit.create({
                            theaterId: newTheater.id,
                            theaterUnitName: `Rạp ${index + 1}`,
                        });
                    }
                );
            } catch (error) {
                next(error);
            }
            res.status(200).send('Tạo Cụm Rạp Thành Công');
        } catch (error) {
            next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (req.body.cinemaId) {
                throw new ErrorHandler(
                    400,
                    'Bạn Không được thay đổi trường này.'
                );
            }
            const updates = Object.keys(req.body);
            const theaterUpdate = await Theater.findByPk(id);
            updates.forEach((update) => {
                if (!(update in theaterUpdate)) {
                    throw new ErrorHandler(
                        400,
                        `trường ${update} không tồn tại`
                    );
                }
                theaterUpdate[update] = req.body[update];
            });
            await theaterUpdate.save();
            res.status(200).json('Cập nhật Thành công');
        } catch (error) {
            next(error);
        }
    };
    softDelete = async (req, res, next) => {
        try {
            const { id } = req.params;
            await Theater.destroy({
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
            await Theater.destroy({
                where: { id },
                force: true,
            });
            res.status(200).send({ message: 'Đã Xóa Vĩnh Viễn' });
        } catch (error) {
            next(error);
        }
    };
    restore = async (req, res, next) => {
        try {
            const { id } = req.params;
            await Theater.restore({
                where: { id },
            });
            res.status(200).send({
                message: 'Khôi phục Rạp thành công!',
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new theaterController();
