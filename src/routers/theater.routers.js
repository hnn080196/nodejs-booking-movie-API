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
const theaterRouter = express.Router();
// 1
theaterRouter.get('/get-all', theaterController.getAll);
theaterRouter.get(
    '/get-theater-by-cinema/:cinemaSlug',
    theaterController.getTheaterByCinema
);
theaterRouter.get(
    '/get-deleted-list',
    authenticate,
    authorize(['superadmin']),
    theaterController.getDeletedList
);

theaterRouter.get(
    '/get-info/:id',
    authenticate,
    authorize(['superadmin']),
    checkExist(Theater),
    theaterController.getInfo
);

theaterRouter.post(
    '/add-new/:cinemaSlug',
    authenticate,
    authorize(['superadmin']),
    theaterController.addNew
);
theaterRouter.put(
    '/update/:id',
    authenticate,
    authorize(['superadmin']),
    checkExist(Theater),
    theaterController.update
);
theaterRouter.delete(
    '/soft-delete/:id',
    authenticate,
    authorize(['superadmin']),
    checkExist(Theater),
    theaterController.softDelete
);
theaterRouter.get(
    '/restore/:id',
    authenticate,
    authorize(['superadmin']),
    checkExistDeletedList(Theater),
    theaterController.restore
);

theaterRouter.delete(
    '/force-delete/:id',
    authenticate,
    authorize(['admin', 'superadmin']),
    checkExistDeletedList(Theater),
    theaterController.forceDelete
);
module.exports = { theaterRouter };
