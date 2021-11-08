const { User, Ticket } = require('../models');
const bcryptjs = require('bcryptjs');
const Op = require('sequelize').Op;
const { ErrorHandler } = require('../helpers/error');
class UserController {
    // {{url}}/users/get-all-user?search&email=abc
    getAll = async (req, res, next) => {
        if (req.query.hasOwnProperty('_search')) {
            const { keyWord } = req.query;
            const searchList = await User.findAll({
                where: {
                    email: { [Op.like]: '%' + keyWord + '%' },
                    deletedAt: null,
                },
            });
            res.status(200).json({
                data: searchList,
                msg: 'Lấy dữ liệu thành công',
            });
        }
        const userList = await User.findAll({
            where: { deletedAt: null },
        });
        res.status(200).json({
            data: userList,
            msg: 'Lấy dữ liệu thành công',
        });
    };
    getAllPagination = async (req, res, next) => {
        const { keyWord, page, perPage } = req.query;
        if (page > 0 && perPage > 0) {
            const pagination = await User.findAndCountAll({
                where: {
                    email: { [Op.like]: '%' + keyWord + '%' },
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

    getDeleteList = async (req, res, next) => {
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
    };
    // get user Info (done)
    getInfo = async (req, res, next) => {
        const { id } = req.params;
        const user = await User.findByPk(id);
        res.status(200).send(user);
    };
    addNew = async (req, res, next) => {
        const { name, email, password, phone, role } = req.body;
        const salt = bcryptjs.genSaltSync(10);
        const hashPassword = bcryptjs.hashSync(password, salt);
        await User.create({
            name,
            email,
            password: hashPassword,
            phone,
            role,
        });
        res.status(201).send('Tạo Tài Khoản Thành Công!');
    };
    update = async (req, res, next) => {
        const { user } = req;
        const { role } = req.body;
        if (!role) {
            throw new ErrorHandler(400, 'Role Không được bỏ trống.');
        } else {
            switch (user.role) {
                case 'client':
                    if (role !== 'client') {
                        throw new ErrorHandler(
                            400,
                            'Không có quyền sửa trường này.'
                        );
                    }
                    break;
                case 'admin':
                    if (role === 'superadmin' || role === 'admin') {
                        throw new ErrorHandler(
                            400,
                            'Không có quyền sửa trường này.'
                        );
                    }
                    break;
                default:
                    break;
            }
        }
        const data = req.body;
        await User.update(data, {
            where: {
                id: user.id,
            },
        });
        res.status(200).json({ msg: 'Cập Nhật thành công' });
    };
    updateForSuperadmin = async (req, res, next) => {
        const { id } = req.params;
        const data = req.body;
        await User.update(data, {
            where: {
                id,
            },
        });
        res.status(200).json({ msg: 'Cập Nhật thành công' });
    };
    softDelete = async (req, res, next) => {
        const { id } = req.params;
        const checkingUser = await User.findOne({ where: { id } });
        const hasTicket = await Ticket.findOne({
            where: {
                bookingUser: checkingUser.email,
            },
        });
        if (hasTicket) {
            throw new ErrorHandler(400, 'Tài khoản đã đặt vé, không thể xóa.');
        }
        await User.destroy({
            where: {
                id,
            },
        });
        res.status(200).json({ msg: 'Đã Xóa Tài Khoản.' });
    };
    forceDelete = async (req, res, next) => {
        const { id } = req.params;
        await User.destroy({
            where: {
                id,
            },
            force: true,
        });
        res.status(200).json({ msg: 'Đã Xóa Vĩnh Viễn!!' });
    };
    restoreUser = async (req, res, next) => {
        const { id } = req.params;
        await User.restore({
            where: {
                id,
            },
        });
        res.status(200).send({
            msg: 'Khôi phục tài khoản thành công!',
        });
    };
    // upload avatar
    uploadAvatar = async (req, res) => {
        const { file, user } = req;
        if (!file) {
            throw new ErrorHandler(400, 'Vui Lòng Chọn File');
        }
        const urlImage = `http://localhost:9000/${file.path}`;
        const userUploadAvatar = await User.findByPk(user.id);
        userUploadAvatar.avatar = urlImage;
        await userUploadAvatar.save();
        res.status(200).json({ msg: 'Cập Nhật Ảnh Thành Công!' });
    };
}

module.exports = new UserController();
