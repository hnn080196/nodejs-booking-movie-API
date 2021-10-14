"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Movie }) {
      // define association here
      // this = Ticket
      // mặc đinh ko có foreignkey nó tự sinh ra id 
      //
      this.belongsTo(User, { foreignKey: "userId" });
      this.belongsTo(Movie, { foreignKey: "movieId" });
    }
  }
  Ticket.init(
    {
      userId: DataTypes.INTEGER,
      movieId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Ticket",
    }
  );
  return Ticket;
};
