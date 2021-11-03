'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Showtime extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Movie, { foreignKey: 'movieId' });
            this.belongsTo(models.TheaterUnit, { foreignKey: 'theaterUnitId' });
            this.hasMany(models.Seat, {
                foreignKey: 'showtimeId',
                onDelete: 'CASCADE',
            });
            this.hasMany(models.Ticket, { foreignKey: 'showtimeId' });
        }
    }
    Showtime.init(
        {
            movieId: DataTypes.INTEGER,
            theaterUnitId: DataTypes.INTEGER,
            showtime: {
                type: DataTypes.DATE,
                validate: {
                    notEmpty: { args: true, msg: 'Nhập vào trường này!!' },
                },
            },
            price: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { args: true, msg: 'Nhập vào trường này!!' },
                },
            },
        },
        {
            sequelize,
            deletedAt: 'deletedAt',
            paranoid: true,
            timestamps: true,
            modelName: 'Showtime',
        }
    );
    return Showtime;
};
