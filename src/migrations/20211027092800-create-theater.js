'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Theaters', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            cinemaId: {
                type: Sequelize.INTEGER,
                // Liên kết bảng users
                references: {
                    model: 'Cinemas',
                    key: 'id',
                },
            },
            theaterName: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            slug: {
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
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Theaters');
    },
};
