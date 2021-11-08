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
    checkExistDeletedList,
} = require('../middlewares/validations/check-exist.middlewares');
const { User } = require('../models');
const { asyncMiddleware } = require('../utils/asyncMiddleware');

const userRouter = express.Router();
//---------Upload avatar--------
userRouter.post(
    '/upload-avatar',
    authenticate,
    uploadImageSingle('avatar'),
    asyncMiddleware(userController.uploadAvatar)
);
//--------Get Deleted User List--------
userRouter.get(
    '/get-delete-list',
    logsUser,
    authenticate,
    authorize(['admin', 'superadmin']),
    asyncMiddleware(userController.getDeleteList)
);

//---------Get All User --------
userRouter.get(
    '/get-all-user',
    logsUser,
    authenticate,
    authorize(['admin', 'superadmin']),
    asyncMiddleware(userController.getAll)
);
userRouter.get(
    '/get-all-pagination',
    logsUser,
    authenticate,
    authorize(['admin', 'superadmin']),
    asyncMiddleware(userController.getAllPagination)
);
//---------get detail user for higher level from admin  --------
//
userRouter.get(
    '/get-info/:id',
    authenticate,
    authorize(['superadmin']),
    checkExist(User),
    asyncMiddleware(userController.getInfo)
);

//---------Add new use for higher level from Admin --------
userRouter.post(
    '/add-new',
    authenticate,
    authorize(['admin', 'superadmin']),
    asyncMiddleware(userController.addNew)
);
//---------update use for client --------
// ---- with value of role = 'client' is fixed
userRouter.put(
    '/update/:id',
    authenticate,
    asyncMiddleware(userController.update)
);
//---------update use for superadmin  --------
// ---- can change value of role under level of role =superadmin
userRouter.put(
    '/update-for-admin/:id',
    authenticate,
    authorize(['superadmin']),
    checkExist(User),
    asyncMiddleware(userController.updateForSuperadmin)
);
//---------soft delete authorize include 'admin' and 'superadmin' --------
userRouter.delete(
    '/soft-delete/:id',
    authenticate,
    authorize(['admin', 'superadmin']),
    checkExist(User),
    asyncMiddleware(userController.softDelete)
);
//---------restore deleted user just authorize for role='superadmin' --------
// check exist in deleted user list
userRouter.get(
    '/restore-deleted-user/:id',
    authenticate,
    authorize(['superadmin']),
    checkExistDeletedList(User),
    asyncMiddleware(userController.restoreUser)
);
//---------force deleted user just authorize for role='superadmin' --------
// check exist in deleted user list
userRouter.delete(
    '/force-delete/:id',
    authenticate,
    authorize(['superadmin']),
    checkExistDeletedList(User),
    asyncMiddleware(userController.forceDelete)
);
//---------force deleted user just authorize for role='superadmin' --------
// userRouter.get(
//     '/movie-by-user/:id',
//     authenticate,
//     checkExist(User),
//     userController.getMovieByUser
// );
module.exports = {
    userRouter,
};
