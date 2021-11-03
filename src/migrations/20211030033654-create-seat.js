'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Seats', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            showtimeId: {
                type: Sequelize.INTEGER,
            },
            seatName: {
                type: Sequelize.STRING,
            },
            seatType: {
                type: Sequelize.STRING,
            },
            isBooking: {
                type: Sequelize.BOOLEAN,
            },
            userBooking: {
                type: Sequelize.STRING,
            },
            price: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Seats');
    },
};
