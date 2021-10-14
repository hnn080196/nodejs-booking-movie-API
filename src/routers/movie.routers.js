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

/**
 * http://localhost:9000/api/v1/movies
 */
const movieRouter = express.Router();
// http://localhost:9000/api/v1/movies/add-new-movie/1
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

// http://localhost:9000/api/v1/movies/get-all-movie
movieRouter.get("/get-all-movie", getAllMovie);

// http://localhost:9000/api/v1/movies/get-info-movie/
movieRouter.get("/get-info-movie/:id", getInfoMovie);

// http://localhost:9000/api/v1/movies/update-movie/1
movieRouter.put("/update-movie/:id", updateMovie);

// http://localhost:9000/api/v1/movies/delete-movie/1
movieRouter.delete("/delete-movie/:id", deleteMovie);
module.exports = {
  movieRouter,
};
