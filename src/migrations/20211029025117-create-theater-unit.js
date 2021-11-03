'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('TheaterUnits', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            theaterId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Theaters',
                    key: 'id',
                },
            },
            theaterUnitName: {
                type: Sequelize.STRING,
            },
            slug: { type: Sequelize.STRING },
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
        await queryInterface.dropTable('TheaterUnits');
    },
};
