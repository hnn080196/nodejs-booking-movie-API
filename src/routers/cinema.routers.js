const express = require('express');
const cinemaController = require('../controllers/cinema.controller');
const {
    authenticate,
    authorize,
} = require('../middlewares/auth/verify-token.middlewares');
const {
    uploadImageSingle,
} = require('../middlewares/upload/upload-image.middlewares');
const cinemaRouter = express.Router();
cinemaRouter.get('/get-all-cinema', cinemaController.getAll);
cinemaRouter.get('/:id/get-info-cinema', cinemaController.getInfo);
cinemaRouter.post(
    '/add-new-cinema',
    authenticate,
    authorize(['admin', 'superadmin']),
    uploadImageSingle('cinema-logo'),
    cinemaController.addNew
);
cinemaRouter.put('/:id/update-cinema', cinemaController.update);
cinemaRouter.delete('/:id/delete-cinema', cinemaController.delete);
module.exports = cinemaRouter;
