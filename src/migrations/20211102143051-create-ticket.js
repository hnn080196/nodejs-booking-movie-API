'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Tickets', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            showtimeId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Showtimes',
                    key: 'id',
                },
            },
            seatId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Seats',
                    key: 'id',
                },
            },
            seatName: {
                type: Sequelize.STRING,
            },
            seatType: {
                type: Sequelize.STRING,
            },
            price: {
                type: Sequelize.STRING,
            },
            theaterUnitName: {
                type: Sequelize.STRING,
            },
            theaterName: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            bookingUser: {
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
        await queryInterface.dropTable('Tickets');
    },
};
