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
const { asyncMiddleware } = require('../utils/asyncMiddleware');

const theaterUnitRouter = express.Router();
// 1
theaterUnitRouter.get(
    '/get-all',
    authenticate,
    authorize(['superadmin']),
    asyncMiddleware(theaterUnitController.getAll)
);
theaterUnitRouter.get(
    '/get-deleted-list',
    authenticate,
    authorize(['superadmin']),
    asyncMiddleware(theaterUnitController.getDeletedList)
);

theaterUnitRouter.get(
    '/get-info/:id',
    authenticate,
    authorize(['superadmin']),
    checkExist(TheaterUnit),
    asyncMiddleware(theaterUnitController.getInfo)
);

theaterUnitRouter.post(
    '/add-new/:theaterSlug',
    authenticate,
    authorize(['superadmin']),
    asyncMiddleware(theaterUnitController.addNew)
);
theaterUnitRouter.put(
    '/update/:id',
    authenticate,
    authorize(['superadmin']),
    checkExist(TheaterUnit),
    asyncMiddleware(theaterUnitController.update)
);
theaterUnitRouter.delete(
    '/soft-delete/:id',
    authenticate,
    authorize(['superadmin']),
    checkExist(TheaterUnit),
    asyncMiddleware(theaterUnitController.softDelete)
);
theaterUnitRouter.get(
    '/restore/:id',
    authenticate,
    authorize(['superadmin']),
    checkExistDeletedList(TheaterUnit),
    asyncMiddleware(theaterUnitController.restore)
);

theaterUnitRouter.delete(
    '/force-delete/:id',
    authenticate,
    authorize(['superadmin']),
    checkExistDeletedList(TheaterUnit),
    asyncMiddleware(theaterUnitController.forceDelete)
);
module.exports = { theaterUnitRouter };
