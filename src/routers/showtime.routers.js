const express = require('express');
const { Showtime } = require('../models');
const showtimeController = require('../controllers/showtime.controller');
const {
    authenticate,
    authorize,
} = require('../middlewares/auth/verify-token.middlewares');
const {
    checkExist,
    checkExistDeletedList,
} = require('../middlewares/validations/check-exist.middlewares');
const { asyncMiddleware } = require('../utils/asyncMiddleware');
const showtimeRouter = express.Router();
// 1
showtimeRouter.get(
    '/get-all',
    authenticate,
    asyncMiddleware(showtimeController.getAll)
);
showtimeRouter.get(
    '/get-showtime-by-movie/:movieId',
    authenticate,
    asyncMiddleware(showtimeController.getShowtimeByMovieId)
);
showtimeRouter.get(
    '/get-showtime-by-cinema/:cinemaSlug',
    authenticate,
    asyncMiddleware(showtimeController.getShowtimeByCinema)
);
showtimeRouter.get(
    '/get-seat-list-by-showtime/:id',
    authenticate,
    checkExist(Showtime),
    asyncMiddleware(showtimeController.getSeatListByShowtime)
);
showtimeRouter.get(
    '/get-deleted-list',
    authenticate,
    authorize(['admin', 'superadmin']),

    asyncMiddleware(showtimeController.getDeletedList)
);

showtimeRouter.get(
    '/get-info/:id',
    authenticate,
    authorize(['admin', 'superadmin']),
    checkExist(Showtime),
    asyncMiddleware(showtimeController.getInfo)
);
showtimeRouter.post(
    '/add-new',
    authenticate,
    asyncMiddleware(showtimeController.addNew)
);
showtimeRouter.delete(
    '/soft-delete/:id',
    authenticate,
    authorize(['admin', 'superadmin']),
    checkExist(Showtime),
    asyncMiddleware(showtimeController.softDelete)
);
showtimeRouter.get(
    '/restore/:id',
    authenticate,
    authorize(['superadmin']),
    checkExistDeletedList(Showtime),
    asyncMiddleware(showtimeController.restore)
);

showtimeRouter.delete(
    '/force-delete/:id',
    authenticate,
    authorize(['superadmin']),
    checkExistDeletedList(Showtime),
    asyncMiddleware(showtimeController.forceDelete)
);
module.exports = { showtimeRouter };
