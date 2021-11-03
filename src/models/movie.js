'use strict';
const slugify = require('sequelize-slugify');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Movie extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // this.hasMany(Ticket, { foreignKey: 'movieId' });
            this.belongsToMany(models.User, {
                through: 'User_Movie',
                as: 'users',
                foreignKey: 'movieId',
                otherKey: 'userId',
            });
            this.belongsToMany(models.Cinema, {
                through: 'Movie_Cinema',
                as: 'cinemas',
                foreignKey: 'movieId',
                otherKey: 'cinemaId',
            });
            this.hasMany(models.Showtime, {
                foreignKey: 'movieId',
            });
        }
    }
    Movie.init(
        {
            movieName: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { args: true, msg: 'Nhập vào trường này!!' },
                },
            },
            trailer: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { args: true, msg: 'Nhập vào trường này!!' },
                    isUrl: { args: true, msg: 'Sai định dạng URL!' },
                },
            },
            poster: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { args: true, msg: 'Nhập vào trường này!!' },
                },
            },
            description: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { args: true, msg: 'Nhập vào trường này!!' },
                },
            },
            releaseDate: {
                type: DataTypes.DATE,
                validate: {
                    notEmpty: { args: true, msg: 'Nhập vào trường này!!' },
                },
            },
            rating: {
                type: DataTypes.INTEGER,
                validate: {
                    notEmpty: { args: true, msg: 'Nhập vào trường này!!' },
                },
            },
            slug: {
                type: DataTypes.STRING,
                unique: true,
            },
        },
        {
            sequelize,
            deletedAt: 'deletedAt',
            paranoid: true,
            timestamps: true,
            modelName: 'Movie',
        }
    );
    slugify.slugifyModel(Movie, {
        source: ['movieName'],
    });
    return Movie;
};
