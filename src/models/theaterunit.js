'use strict';
const { Model } = require('sequelize');
const slugify = require('sequelize-slugify');

module.exports = (sequelize, DataTypes) => {
    class TheaterUnit extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Theater, Showtime }) {
            this.belongsTo(Theater, { foreignKey: 'theaterId' });
            // define association here
            this.hasMany(Showtime, {
                foreignKey: 'theaterUnitId',
                onDelete: 'CASCADE',
            });
        }
    }
    TheaterUnit.init(
        {
            theaterId: DataTypes.INTEGER,
            theaterUnitName: DataTypes.STRING,
            slug: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            deletedAt: 'deletedAt',
            paranoid: true,
            timestamps: true,
            modelName: 'TheaterUnit',
        }
    );
    slugify.slugifyModel(TheaterUnit, {
        source: ['theaterUnitName'],
    });
    return TheaterUnit;
};
