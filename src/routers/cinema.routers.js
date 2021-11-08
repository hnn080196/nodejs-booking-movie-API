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
const { asyncMiddleware } = require('../utils/asyncMiddleware');
const cinemaRouter = express.Router();
// 1

cinemaRouter.post(
    '/add-new',
    authenticate,
    authorize(['admin', 'superadmin']),
    uploadImageSingle('cinemaLogo'),
    asyncMiddleware(cinemaController.addNewCinema)
);
cinemaRouter.get('/get-all', asyncMiddleware(cinemaController.getAll));
cinemaRouter.get(
    '/get-deleted-list',
    authenticate,
    authorize(['superadmin']),
    asyncMiddleware(cinemaController.getDeletedCinema)
);

cinemaRouter.get(
    '/get-info/:id',
    checkExist(Cinema),
    asyncMiddleware(cinemaController.getInfo)
);

cinemaRouter.put(
    '/update/:id',
    authenticate,
    authorize(['admin', 'superadmin']),
    uploadImageSingle('cinemaLogo'),
    asyncMiddleware(cinemaController.update)
);
cinemaRouter.delete(
    '/soft-delete/:id',
    authenticate,
    authorize(['superadmin']),
    checkExist(Cinema),
    asyncMiddleware(cinemaController.softDelete)
);
cinemaRouter.get(
    '/restore/:id',
    authenticate,
    authorize(['superadmin']),
    checkExistDeletedList(Cinema),
    asyncMiddleware(cinemaController.restoreCinema)
);

cinemaRouter.delete(
    '/force-delete/:id',
    authenticate,
    authorize(['superadmin']),
    checkExistDeletedList(Cinema),
    asyncMiddleware(cinemaController.forceDelete)
);

module.exports = cinemaRouter;
