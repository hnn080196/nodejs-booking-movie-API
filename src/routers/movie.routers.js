const express = require('express');
const movieController = require('../controllers/movie.controller');
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

const { Movie } = require('../models');

/**
 * http://localhost:9000/api/v1/movies
 */
const movieRouter = express.Router();

movieRouter.post(
    '/add-new-movie',
    authenticate,
    authorize(['admin', 'superadmin']),
    uploadImageSingle('poster'),
    asyncMiddleware(movieController.addNew)
);
movieRouter.post(
    '/add-relation-movie-cinema',
    authenticate,
    authorize(['admin', 'superadmin']),
    asyncMiddleware(movieController.addCinemaToMovie)
);
movieRouter.get('/get-all-movie', asyncMiddleware(movieController.getAll));
movieRouter.get(
    '/get-movie-pagination',
    asyncMiddleware(movieController.getMoviePagination)
);
movieRouter.get(
    '/get-deleted-list',
    authenticate,
    authorize(['admin', 'superadmin']),
    asyncMiddleware(movieController.getDeletedList)
);
movieRouter.get(
    '/get-info-movie/:id',
    checkExist(Movie),
    asyncMiddleware(movieController.getInfo)
);

movieRouter.put(
    '/update-movie/:id',
    authenticate,
    authorize(['admin', 'superadmin']),
    checkExist(Movie),
    uploadImageSingle('poster'),
    asyncMiddleware(movieController.update)
);
movieRouter.delete(
    '/soft-delete/:id',
    authenticate,
    authorize(['admin', 'superadmin']),
    checkExist(Movie),
    asyncMiddleware(movieController.softDelete)
);
movieRouter.get(
    '/restore-deleted-movie/:id',
    authenticate,
    authorize(['superadmin']),
    checkExistDeletedList(Movie),
    asyncMiddleware(movieController.restoreMovie)
);
movieRouter.delete(
    '/force-delete/:id',
    authenticate,
    authorize(['superadmin']),
    checkExistDeletedList(Movie),
    asyncMiddleware(movieController.forceDelete)
);

module.exports = {
    movieRouter,
};
