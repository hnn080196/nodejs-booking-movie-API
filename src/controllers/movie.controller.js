const { Movie } = require("../models");
const { sequelize } = require("../models");
// get all movie (done)
const getAllMovie = async (req, res) => {
  try {
    const movieList = await Movie.findAll();
    res.status(200).send(movieList);
  } catch (error) {
    res.status(500).send({
      message: "Lỗi Server",
    });
  }
};

// get info movie (done)
const getInfoMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movieDetail = await Movie.findByPk(id);
    res.status(200).send(movieDetail);
  } catch (error) {
    res.status(500).send({
      message: "Lỗi Server",
    });
  }
};
//
const addNewMovie = async (req, res) => {
  try {
    const { file } = req;
    const urlPoster = `http://localhost:9000/${file.path}`;
    if (!file) {
      const error = new Error("Vui Lòng Chọn File");
      error.httpStatusCode = 400;
      return next(error);
    }
    req.body.poster = urlPoster;
    const newMovie = await Movie.create(req.body);
    res.status(201).send(newMovie);
  } catch (error) {
    res.status(500).send({
      message: "Lỗi Server",
      error,
    });
  }
};

const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { file } = req;
    const urlPoster = `http://localhost:9000/${file.path}`;
    if (!file) {
      const error = new Error("Vui Lòng Chọn File");
      error.httpStatusCode = 400;
      return next(error);
    }
    req.body.poster = urlPoster;
    const data = req.body;
    await User.update(data, {
      where: {
        id,
      },
    });
    res.status(200).send("update thành công");
  } catch (error) {
    res.status(500).send({
      message: "Lỗi Server",
    });
  }
};
const deleteMovie = (req, res) => {
  try {
    const { id } = req.params;

    res.send("deleteMovie");
  } catch (error) {
    res.status(500).send({
      message: "Lỗi Server",
    });
  }
};

module.exports = {
  getAllMovie,
  addNewMovie,
  updateMovie,
  deleteMovie,
  getInfoMovie,
};
