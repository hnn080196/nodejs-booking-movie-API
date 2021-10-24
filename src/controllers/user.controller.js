const { User } = require('../models');
const bcryptjs = require('bcryptjs');
const { sequelize } = require('../models');

class UserController {
    // get all user (done)
    getAll = async (req, res) => {
        try {
            const userList = await User.findAll({
                where: { deletedAt: null },
            });
            res.status(200).send(userList);
        } catch (error) {
            res.status(500).send({
                message: 'Lỗi Server',
                error,
            });
        }
    };
    getDeleteList = async (req, res) => {
        try {
            const deletedUserList = await User.findAll({
                where: { deletedAt: { ne: null } },
                paranoid: false,
            });
            res.status(200).send(deletedUserList);
        } catch (error) {
            res.status(500).send({
                message: 'Lỗi Server',
                error,
            });
        }
    };
    // get user Info (done)
    getInfo = async (req, res) => {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);
            res.status(200).send(user);
        } catch (error) {
            res.status(500).send({
                message: 'Lỗi Server',
                error,
            });
        }
    };
    addNew = async (req, res) => {
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
            res.status(201).send(newUser);
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
            const data = req.body;
            await User.update(data, {
                where: {
                    id,
                },
            });

            res.status(200).send('update thành công');
        } catch (error) {
            res.status(500).send({
                message: 'Lỗi Server',
                error,
            });
        }
    };
    softDelete = async (req, res) => {
        try {
            const { id } = req.params;
            // const { detailInfo } = req;
            await User.destroy({
                where: {
                    id,
                },
            });
            // res.status(200).send(detailInfo);
            res.send('xoa thanh cong');
        } catch (error) {
            res.status(500).send({
                message: 'Lỗi Server',
                error,
            });
        }
    };
    forceDelete = async (req, res) => {
        try {
            const { id } = req.params;
            const { detailInfo } = req;
            await User.destroy({
                where: {
                    id,
                },
                force: true,
            });
            res.status(200).send(detailInfo);
        } catch (error) {
            res.status(500).send({
                message: 'Lỗi Server',
                error,
            });
        }
    };
    // upload avatar
    uploadAvatar = async (req, res) => {
        try {
            const { file, user } = req;
            const urlImage = `http://localhost:9000/${file.path}`;
            if (!file) {
                // chọn file nhưng hủy thao tác
                const error = new Error('Vui Lòng Chọn File');
                error.httpStatusCode = 400;
                return next(error);
            }
            const userUploadAvatar = await User.findByPk(user.id);
            userUploadAvatar.avatar = urlImage;
            await userUploadAvatar.save();
            res.status(200).send(userUploadAvatar);
        } catch (error) {
            res.status(500).send({
                message: 'Lỗi Server',
                error,
            });
        }
    };

    getMovieByUser = async (req, res) => {
        const { id } = req.params;
        const queryString = `
            select movies.movieName , users.name as userName from movies 
            inner join tickets 
            on movies.id = tickets.movieId
            inner join users
            on users.id = tickets.userId
            where users.id = ${id};`;
        const [result] = await sequelize.query(queryString);
        res.send(result);
    };
}

module.exports = new UserController();
