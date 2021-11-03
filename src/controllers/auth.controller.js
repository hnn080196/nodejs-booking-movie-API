const { User } = require('../models');
const bcryptjs = require('bcryptjs');
const { generateToken } = require('../utils/token.utils');
const { ErrorHandler } = require('../helpers/error');
class AuthController {
    signIn = async (req, res) => {
        try {
            const { email, password } = req.body;
            /**
             * các bước xác thực :
             *      1/ tìm user theo cái email
             *      2/ kiểm tra password
             */
            const userSignIn = await User.findOne({
                where: {
                    email,
                },
            });
            if (userSignIn) {
                const isCheckPassword = bcryptjs.compareSync(
                    password,
                    userSignIn.password
                );
                if (isCheckPassword) {
                    // tạo token
                    const token = generateToken(
                        userSignIn.id,
                        userSignIn.email,
                        userSignIn.role
                    );
                    res.status(200).send({
                        message: 'Đăng nhập thành công',
                        token,
                    });
                } else {
                    res.status(400).send({
                        message: 'Mật Khẩu ko chính xác',
                    });
                }
            } else {
                res.status(404).send({
                    message: 'không tìm thấy email phù hợp',
                });
            }
        } catch (error) {
            res.status(500).send(error);
        }
    };
    signUp = async (req, res, next) => {
        try {
            const { name, email, password, phone, role } = req.body;
            if (role !== 'client') {
                throw new ErrorHandler(400, 'Bạn không được cấp quyền này');
            }
            const salt = bcryptjs.genSaltSync(10);
            const hashPassword = bcryptjs.hashSync(password, salt);
            await User.create({
                name,
                email,
                password: hashPassword,
                phone,
                role: 'client',
            });
            res.status(200).json({ message: 'Tạo Tài Khoản Thành Công' });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new AuthController();
