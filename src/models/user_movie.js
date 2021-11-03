'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User_Movie extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    User_Movie.init(
        {
            selfGranted: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            timestamps: false,
            modelName: 'User_Movie',
        }
    );
    return User_Movie;
};
