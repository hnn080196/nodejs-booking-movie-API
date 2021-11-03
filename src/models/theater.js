'use strict';
const { Model } = require('sequelize');
const slugify = require('sequelize-slugify');
module.exports = (sequelize, DataTypes) => {
    class Theater extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Cinema, TheaterUnit }) {
            // define association here
            this.belongsTo(Cinema, {
                foreignKey: 'cinemaId',
            });
            this.hasMany(TheaterUnit, {
                foreignKey: 'theaterId',
                onDelete: 'CASCADE',
            });
        }
    }
    Theater.init(
        {
            cinemaId: DataTypes.INTEGER,
            theaterName: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { args: true, msg: 'Nhập vào trường này!!' },
                },
            },
            address: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { args: true, msg: 'Nhập vào trường này!!' },
                },
            },
            slug: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            deletedAt: 'deletedAt',
            paranoid: true,
            timestamps: true,
            modelName: 'Theater',
        }
    );
    slugify.slugifyModel(Theater, {
        source: ['theaterName'],
    });
    return Theater;
};
