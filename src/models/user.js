'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // this.hasMany(Ticket, { foreignKey: 'userId' });
            this.belongsToMany(models.Movie, {
                through: 'User_Movie',
                as: 'movies',
                foreignKey: 'userId',
                otherKey: 'movieId',
            });
            this.hasMany(models.Ticket, {
                foreignKey: 'userId',
                as: 'tickets',
            });
        }
    }
    User.init(
        {
            name: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { args: true, msg: 'Nhập vào trường này!!' },
                },
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    notEmpty: { args: true, msg: 'Nhập vào trường này!!' },
                    isEmail: { args: true, msg: 'Format không chính xác!' },
                },
            },
            password: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { args: true, msg: 'Nhập vào trường này!!' },
                    len: { args: [8], msg: 'Ít nhất 8 ký tự.' },
                },
            },
            phone: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { args: true, msg: 'Nhập vào trường này!!' },
                    len: { args: [10], msg: 'Phone ít nhất 10 ký tự.' },
                    is: { args: ['^[0-9]*$'], msg: 'Phone định dạng số .' },
                },
            },
            role: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { args: true, msg: 'Nhập vào trường này!!' },
                    isIn: {
                        args: [['client', 'admin', 'superadmin']],
                        msg: 'Giá trị không đúng format:client,admin,superadmin',
                    },
                },
            },
            avatar: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            deletedAt: 'deletedAt',
            paranoid: true,
            timestamps: true,
            modelName: 'User',
        }
    );
    return User;
};
