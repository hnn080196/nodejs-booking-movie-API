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
movieRouter.get('/get-all-movie', movieController.getAll);

movieRouter.get('/get-info-movie/:id', movieController.getInfo);

movieRouter.put(
    '/update-movie/:id',
    authenticate,
    authorize(['admin', 'superadmin']),
    checkExist(Movie),
    uploadImageSingle('poster'),
    movieController.update
);
movieRouter.delete(
    '/delete-movie/:id',
    authenticate,
    authorize(['admin', 'superadmin']),
    checkExist(Movie),
    movieController.delete
);
module.exports = {
    movieRouter,
};
