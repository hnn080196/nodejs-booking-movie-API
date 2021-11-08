const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../../helpers/error');
const { SECRET_KEY } = require('../../utils/configs');

// kiểm tra người dùng có đăng nhập hay chưa
const authenticate = (req, res, next) => {
    const token = req.header('token');
    try {
        const secretKey = SECRET_KEY;
        const decode = jwt.verify(token, secretKey);
        console.log(decode);
        req.user = decode;
        next();
    } catch (error) {
        throw new ErrorHandler(401, 'Bạn Chưa Đăng Nhập');
    }
};

// phân quyền người dùng
const authorize = (arrayRole) => (req, res, next) => {
    try {
        const { user } = req;
        if (arrayRole.includes(user.role)) {
            console.log('pass authorize');
            next();
        } else {
            throw new ErrorHandler(
                403,
                'Bạn không được phân quyền chức năng này'
            );
        }
    } catch (error) {
        next(ErrorHandler(500, 'Lỗi Máy Chủ'));
    }
};

module.exports = {
    authenticate,
    authorize,
};
