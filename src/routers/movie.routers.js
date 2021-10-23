const express = require("express");
const {
  updateMovie,
  getAllMovie,
  getInfoMovie,
  deleteMovie,
  addNewMovie,
} = require("../controllers/movie.controller");
const {
  authenticate,
  authorize,
} = require("../middlewares/auth/verify-token.middlewares");
const {
  uploadImageSingle,
} = require("../middlewares/upload/upload-image.middlewares");
const {
  checkExist,
} = require("../middlewares/validations/check-exist.middlewares");
const { Movie } = require("../models");

/**
 * http://localhost:9000/api/v1/movies
 */
const movieRouter = express.Router();
movieRouter.post(
  "/add-new-movie",
  authenticate,
  authorize(["admin", "superadmin"]),
  function (req, res, next) {
    console.log(req.body);
    next();
  },
  uploadImageSingle("poster"),
  addNewMovie
);
movieRouter.get("/get-all-movie", getAllMovie);

movieRouter.get("/get-info-movie/:id", getInfoMovie);

movieRouter.put(
  "/update-movie/:id",
  authenticate,
  authorize(["admin", "superadmin"]),
  checkExist(Movie),
 
  uploadImageSingle("poster"),
  updateMovie
);
movieRouter.delete(
  "/delete-movie/:id",
  authenticate,
  authorize(["admin", "superadmin"]),
  checkExist(Movie),
  deleteMovie
);
module.exports = {
  movieRouter,
};
