"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Ticket }) {
      // define association here
      this.hasMany(Ticket, { foreignKey: "movieId" });
    }
  }
  Movie.init(
    {
      movieName: DataTypes.STRING,
      trailer: DataTypes.STRING,
      poster: DataTypes.STRING,
      description: DataTypes.STRING,
      releaseDate: DataTypes.DATE,
      rating: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Movie",
    }
  );
  return Movie;
};
