const express = require('express');
const { TheaterUnit } = require('../models');
const theaterUnitController = require('../controllers/theaterUnit.controller');
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
const theaterUnitRouter = express.Router();
// 1
theaterUnitRouter.get(
    '/get-all',
    authenticate,
    authorize(['superadmin']),
    theaterUnitController.getAll
);
theaterUnitRouter.get(
    '/get-deleted-list',
    authenticate,
    authorize(['superadmin']),
    theaterUnitController.getDeletedList
);

theaterUnitRouter.get(
    '/get-info/:id',
    authenticate,
    authorize(['superadmin']),
    checkExist(TheaterUnit),
    theaterUnitController.getInfo
);

theaterUnitRouter.post(
    '/add-new/:theaterSlug',
    authenticate,
    authorize(['superadmin']),
    theaterUnitController.addNew
);
theaterUnitRouter.put(
    '/update/:id',
    authenticate,
    authorize(['superadmin']),
    checkExist(TheaterUnit),
    theaterUnitController.update
);
theaterUnitRouter.delete(
    '/soft-delete/:id',
    authenticate,
    authorize(['superadmin']),
    checkExist(TheaterUnit),
    theaterUnitController.softDelete
);
theaterUnitRouter.get(
    '/restore/:id',
    authenticate,
    authorize(['superadmin']),
    checkExistDeletedList(TheaterUnit),
    theaterUnitController.restore
);

theaterUnitRouter.delete(
    '/force-delete/:id',
    authenticate,
    authorize(['superadmin']),
    checkExistDeletedList(TheaterUnit),
    theaterUnitController.forceDelete
);
module.exports = { theaterUnitRouter };
