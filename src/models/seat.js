'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Seat extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Showtime, { foreignKey: 'showtimeId' });
            this.hasOne(models.Ticket, { foreignKey: 'seatId' });
        }
    }
    Seat.init(
        {
            showtimeId: DataTypes.INTEGER,
            seatName: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { args: true, msg: 'Please enter this field' },
                },
            },
            seatType: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { args: true, msg: 'Please enter this field' },
                },
            },
            isBooking: {
                type: DataTypes.BOOLEAN,
                validate: {
                    notEmpty: { args: true, msg: 'Please enter this field' },
                },
            },
            price: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { args: true, msg: 'Please enter this field' },
                },
            },
            userBooking: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { args: true, msg: 'Please enter this field' },
                },
            },
        },
        {
            sequelize,
            modelName: 'Seat',
        }
    );
    return Seat;
};
