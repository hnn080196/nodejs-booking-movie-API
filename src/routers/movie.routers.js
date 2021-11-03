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
    movieController.addNew
);
movieRouter.post(
    '/add-relation-movie-cinema',
    authenticate,
    authorize(['admin', 'superadmin']),
    movieController.addCinemaToMovie
);
movieRouter.get('/get-all-movie', movieController.getAll);
movieRouter.get('/get-deleted-list', movieController.getDeletedList);
movieRouter.get(
    '/get-info-movie/:id',
    checkExist(Movie),
    movieController.getInfo
);

movieRouter.put(
    '/update-movie/:id',
    authenticate,
    authorize(['admin', 'superadmin']),
    checkExist(Movie),
    uploadImageSingle('poster'),
    movieController.update
);
movieRouter.delete(
    '/soft-delete/:id',
    authenticate,
    authorize(['admin', 'superadmin']),
    checkExist(Movie),
    movieController.softDelete
);
movieRouter.get(
    '/restore-deleted-movie/:id',
    authenticate,
    authorize(['admin', 'superadmin']),
    checkExistDeletedList(Movie),
    movieController.restoreMovie
);
movieRouter.delete(
    '/force-delete/:id',
    authenticate,
    authorize(['admin', 'superadmin']),
    checkExistDeletedList(Movie),
    movieController.forceDelete
);

module.exports = {
    movieRouter,
};
