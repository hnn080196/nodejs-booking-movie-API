const express = require('express');
const { Theater } = require('../models');
const theaterController = require('../controllers/theater.controller');
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

const theaterRouter = express.Router();
// 1
theaterRouter.get('/get-all', asyncMiddleware(theaterController.getAll));
theaterRouter.get(
    '/get-theater-by-cinema/:cinemaSlug',
    asyncMiddleware(theaterController.getTheaterByCinema)
);
theaterRouter.get(
    '/get-deleted-list',
    authenticate,
    authorize(['superadmin']),
    asyncMiddleware(theaterController.getDeletedList)
);

theaterRouter.get(
    '/get-info/:id',
    authenticate,
    checkExist(Theater),
    asyncMiddleware(theaterController.getInfo)
);

theaterRouter.post(
    '/add-new/:cinemaSlug',
    authenticate,
    authorize(['admin', 'superadmin']),
    asyncMiddleware(theaterController.addNew)
);
theaterRouter.put(
    '/update/:id',
    authenticate,
    authorize(['admin', 'superadmin']),
    checkExist(Theater),
    asyncMiddleware(theaterController.update)
);
theaterRouter.delete(
    '/soft-delete/:id',
    authenticate,
    authorize(['admin', 'superadmin']),
    checkExist(Theater),
    asyncMiddleware(theaterController.softDelete)
);
theaterRouter.get(
    '/restore/:id',
    authenticate,
    authorize(['superadmin']),
    checkExistDeletedList(Theater),
    asyncMiddleware(theaterController.restore)
);

theaterRouter.delete(
    '/force-delete/:id',
    authenticate,
    authorize(['superadmin']),
    checkExistDeletedList(Theater),
    asyncMiddleware(theaterController.forceDelete)
);
module.exports = { theaterRouter };
