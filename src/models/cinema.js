'use strict';
const { Model } = require('sequelize');
const slugify = require('sequelize-slugify');
module.exports = (sequelize, DataTypes) => {
    class Cinema extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Theater, Movie }) {
            // define association here
            this.hasMany(Theater, {
                foreignKey: 'cinemaId',
                onDelete: 'CASCADE',
            });
            this.belongsToMany(Movie, {
                through: 'Movie_Cinema',
                as: 'movies',
                otherKey: 'cinemaId',
                otherKey: 'movieId',
                onDelete: 'CASCADE',
            });
        }
    }
    Cinema.init(
        {
            cinemaName: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { args: true, msg: 'Nhập vào trường này' },
                },
            },
            slug: {
                type: DataTypes.STRING,
            },
            cinemaLogo: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            deletedAt: 'deletedAt',
            paranoid: true,
            timestamps: true,
            modelName: 'Cinema',
        }
    );
    slugify.slugifyModel(Cinema, {
        source: ['cinemaName'],
    });
    return Cinema;
};
