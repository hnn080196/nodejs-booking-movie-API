'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Movies', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            movieName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            trailer: {
                type: Sequelize.STRING,
            },
            poster: {
                type: Sequelize.STRING,
            },
            description: {
                type: Sequelize.STRING,
            },
            slug: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            releaseDate: {
                type: Sequelize.DATE,
            },
            rating: {
                type: Sequelize.INTEGER,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Movies');
    },
};
