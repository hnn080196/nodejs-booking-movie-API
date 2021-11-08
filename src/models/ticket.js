'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Ticket extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.User, { foreignKey: 'userId' });
            this.belongsTo(models.Showtime, { foreignKey: 'showtimeId' });
            this.belongsTo(models.Seat, { foreignKey: 'seatId' });
        }
    }
    Ticket.init(
        {
            userId: DataTypes.INTEGER,
            showtimeId: DataTypes.INTEGER,
            seatId: DataTypes.INTEGER,
            seatName: DataTypes.STRING,
            seatType: DataTypes.STRING,
            price: DataTypes.STRING,
            theaterUnitName: DataTypes.STRING,
            theaterName: DataTypes.STRING,
            address: DataTypes.STRING,
            bookingUser: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Ticket',
        }
    );
    return Ticket;
};
