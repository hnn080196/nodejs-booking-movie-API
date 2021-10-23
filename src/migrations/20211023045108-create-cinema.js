'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Cinemas', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            cinemaCode: {
                type: Sequelize.STRING,
                unique: true,
            },
            cinemaName: {
                type: Sequelize.STRING,
            },
            cinemaSlug: {
                type: Sequelize.STRING,
            },
            cinemaLogo: {
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
        await queryInterface.dropTable('Cinemas');
    },
};
