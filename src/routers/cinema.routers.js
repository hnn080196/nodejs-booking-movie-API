const express = require('express');
const { Cinema } = require('../models');
const cinemaController = require('../controllers/cinema.controller');
const {
    authenticate,
    authorize,
} = require('../middlewares/auth/verify-token.middlewares');
const {
    uploadImageSingle,
} = require('../middlewares/upload/upload-image.middlewares');
const {
    checkExist,
    checkExistDeletedList,
} = require('../middlewares/validations/check-exist.middlewares');
const cinemaRouter = express.Router();
// 1

cinemaRouter.post(
    '/add-new',
    authenticate,
    authorize(['admin', 'superadmin']),
    uploadImageSingle('cinemaLogo'),
    cinemaController.addNewCinema
);
cinemaRouter.get('/get-all', cinemaController.getAll);
cinemaRouter.get(
    '/get-deleted-list',
    authenticate,
    authorize(['superadmin']),
    cinemaController.getDeletedCinema
);

cinemaRouter.get('/get-info/:id', checkExist(Cinema), cinemaController.getInfo);

cinemaRouter.put(
    '/update/:id',
    authenticate,
    authorize(['admin', 'superadmin']),
    uploadImageSingle('cinemaLogo'),
    cinemaController.update
);
cinemaRouter.delete(
    '/soft-delete/:id',
    authenticate,
    authorize(['superadmin']),
    checkExist(Cinema),
    cinemaController.softDelete
);
cinemaRouter.get(
    '/restore/:id',
    authenticate,
    authorize(['superadmin']),
    checkExistDeletedList(Cinema),
    cinemaController.restoreCinema
);

cinemaRouter.delete(
    '/force-delete/:id',
    authenticate,
    authorize(['superadmin']),
    checkExistDeletedList(Cinema),
    cinemaController.forceDelete
);

module.exports = cinemaRouter;
