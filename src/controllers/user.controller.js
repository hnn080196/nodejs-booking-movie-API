const { User, Ticket } = require('../models');
const bcryptjs = require('bcryptjs');
const { sequelize } = require('../models');
const Op = require('sequelize').Op;
const { ErrorHandler } = require('../helpers/error');
class UserController {
    // {{url}}/users/get-all-user?search&email=abc
    getAll = async (req, res, next) => {
        try {
            if (req.query.hasOwnProperty('_search')) {
                const { keyWord } = req.query;
                const searchList = await User.findAll({
                    where: {
                        email: { [Op.like]: '%' + keyWord + '%' },
                        deletedAt: null,
                    },
                });
                res.status(200).send(searchList);
            }
            const userList = await User.findAll({
                where: { deletedAt: null },
            });
            res.status(200).send(userList);
        } catch (error) {
            next(error);
        }
    };

    getDeleteList = async (req, res, next) => {
        try {
            if (req.query.hasOwnProperty('_search')) {
                const { keyWord } = req.query;
                const searchDeletedUserList = await User.findAll({
                    where: {
                        email: { [Op.like]: '%' + keyWord + '%' },
                        deletedAt: { [Op.ne]: null },
                    },
                    paranoid: false,
                });
                res.status(200).send(searchDeletedUserList);
            }
            const deletedUserList = await User.findAll({
                where: { deletedAt: { [Op.ne]: null } },
                paranoid: false,
            });
            res.status(200).send(deletedUserList);
        } catch (error) {
            next(error);
        }
    };
    // get user Info (done)
    getInfo = async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);
            res.status(200).send(user);
        } catch (error) {
            next(error);
        }
    };
    addNew = async (req, res, next) => {
        try {
            const { name, email, password, phone, role } = req.body;
            /* mã hóa password 
          1/ tạo ra một chuổi ngẩu nhiên ( salt )
          2/ mã hóa password + salt
      */
            const salt = bcryptjs.genSaltSync(10);
            const hashPassword = bcryptjs.hashSync(password, salt);
            const newUser = await User.create({
                name,
                email,
                password: hashPassword,
                phone,
                role,
            });
            res.status(201).send('Tạo Tài Khoản Thành Công!');
        } catch (error) {
            next(error);
        }
    };
    updateForClient = async (req, res, next) => {
        try {
            const { user } = req;
            const { role } = req.body;
            if (role && role !== 'client') {
                throw new ErrorHandler(
                    400,
                    'Bạn không có quyền thay đổi trường này'
                );
            }
            const data = req.body;
            await User.update(data, {
                where: {
                    id: user.id,
                },
            });
            res.status(200).send('Cập Nhật thành công');
        } catch (error) {
            next(error);
        }
    };
    updateForSuperadmin = async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = req.body;
            await User.update(data, {
                where: {
                    id,
                },
            });
            res.status(200).send('Cập Nhật thành công');
        } catch (error) {
            next(error);
        }
    };
    softDelete = async (req, res, next) => {
        try {
            const { id } = req.params;
            const checkingUser = await User.findOne({ where: { id } });
            const hasTicket = await Ticket.findOne({
                where: {
                    bookingUser: checkingUser.email,
                },
            });
            if (hasTicket) {
                throw new ErrorHandler(
                    400,
                    'Tài khoản đã đặt vé, không thể xóa.'
                );
            }
            await User.destroy({
                where: {
                    id,
                },
            });
            res.status(200).send('Deleted!!!');
        } catch (error) {
            next(error);
        }
    };
    forceDelete = async (req, res, next) => {
        try {
            const { id } = req.params;
            await User.destroy({
                where: {
                    id,
                },
                force: true,
            });
            res.status(200).send('Đã Xóa Vĩnh Viễn!!');
        } catch (error) {
            next(error);
        }
    };
    restoreUser = async (req, res, next) => {
        try {
            const { id } = req.params;
            await User.restore({
                where: {
                    id,
                },
            });
            res.status(200).send({
                message: 'Khôi phục tài khoản thành công!',
            });
        } catch (error) {
            next(new ErrorHandler(500, 'Lỗi Máy Chủ'));
        }
    };
    // upload avatar
    uploadAvatar = async (req, res) => {
        try {
            const { file, user } = req;
            if (!file) {
                throw new ErrorHandler(400, 'Vui Lòng Chọn File');
            }
            const urlImage = `http://localhost:9000/${file.path}`;
            const userUploadAvatar = await User.findByPk(user.id);
            userUploadAvatar.avatar = urlImage;
            await userUploadAvatar.save();
            res.status(200).send('Cập Nhật Ảnh Thành Công!');
        } catch (error) {
            next(error);
        }
    };

    // getMovieByUser = async (req, res) => {
    //     try {
    //         const { id } = req.params;
    //         const rawQuery = `
    //             select movies.movieName , users.name as userName from movies
    //             inner join tickets
    //             on movies.id = tickets.movieId
    //             inner join users
    //             on users.id = tickets.userId
    //             where users.id = ${id};`;
    //         const [result] = await sequelize.query(rawQuery);
    //         res.status(200).send(result);
    //     } catch (error) {
    //         next(ErrorHandler(500, 'Lỗi Máy Chủ'));
    //     }
    // };
}

module.exports = new UserController();
