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
const showtimeRouter = express.Router();
// 1
showtimeRouter.get('/get-all', authenticate, showtimeController.getAll);
showtimeRouter.get(
    '/get-showtime-by-movie/:movieId',
    authenticate,
    showtimeController.getShowtimeByMovieId
);
showtimeRouter.get(
    '/get-showtime-by-cinema/:cinemaSlug',
    authenticate,
    showtimeController.getShowtimeByCinema
);
showtimeRouter.get(
    '/get-seat-list-by-showtime/:id',
    authenticate,
    checkExist(Showtime),
    showtimeController.getSeatListByShowtime
);
showtimeRouter.get(
    '/get-deleted-list',
    authenticate,
    authorize(['admin', 'superadmin']),

    showtimeController.getDeletedList
);

showtimeRouter.get(
    '/get-info/:id',
    authenticate,
    authorize(['admin', 'superadmin']),
    checkExist(Showtime),
    showtimeController.getInfo
);
showtimeRouter.post('/add-new', authenticate, showtimeController.addNew);
showtimeRouter.delete(
    '/soft-delete/:id',
    authenticate,
    authorize(['admin', 'superadmin']),
    checkExist(Showtime),
    showtimeController.softDelete
);
showtimeRouter.get(
    '/restore/:id',
    authenticate,
    authorize(['superadmin']),
    checkExistDeletedList(Showtime),
    showtimeController.restore
);

showtimeRouter.delete(
    '/force-delete/:id',
    authenticate,
    authorize(['superadmin']),
    checkExistDeletedList(Showtime),
    showtimeController.forceDelete
);
module.exports = { showtimeRouter };
