const express = require('express');
const userController = require('../controllers/user.controller');
const {
    authenticate,
    authorize,
} = require('../middlewares/auth/verify-token.middlewares');
const { logsUser } = require('../middlewares/logs/logs-user.middlewares');
const {
    uploadImageSingle,
} = require('../middlewares/upload/upload-image.middlewares');
const {
    checkEmptyUser,
} = require('../middlewares/validations/check-empty.middleware');
const {
    checkExist,
} = require('../middlewares/validations/check-exist.middlewares');
const { User } = require('../models');

/**
 * tạo api quản lý người dùng ( REST APIS )
 *      1/ lấy danh sách người dùng ( get - http://localhost:9000/users )
 *      2/ lấy chi tiết người dùng ( get - http://localhost:9000/users/12 )
 *      3/ tạo người dùng ( post - http://localhost:9000/users )
 *      4/ cập nhật người dùng ( put - http://localhost:9000/users/12 )
 *      5/ xóa người dùng ( delete - http://localhost:9000/users/12 )
 */

const userRouter = express.Router();

userRouter.post(
    '/upload-avatar',
    authenticate,
    uploadImageSingle('avatar'),
    userController.uploadAvatar
);

userRouter.get('/get-delete-list', logsUser, userController.getDeleteList);
userRouter.get('/get-all-user', logsUser, userController.getAll);

userRouter.get('/get-info/:id', checkExist(User), userController.getInfo);

userRouter.post('/add-new', checkEmptyUser, userController.addNew);

userRouter.put('/update/:id', checkExist(User), userController.update);

userRouter.delete(
    '/soft-delete/:id',
    authenticate,
    authorize(['admin', 'superadmin']),
    checkExist(User),
    userController.softDelete
);
userRouter.delete(
    '/force-delete/:id',
    authenticate,
    authorize(['superadmin']),
    userController.forceDelete
);
userRouter.get(
    '/movie-by-user/:id',
    authenticate,
    userController.getMovieByUser
);
module.exports = {
    userRouter,
};
