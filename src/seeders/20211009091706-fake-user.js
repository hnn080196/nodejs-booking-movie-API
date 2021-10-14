"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "Nguyễn Ngọc Hòa",
          email: "hoa123456@gmail.com",
          password: "123456789",
          phone: "035639673",
          role: "admin",
          avatar:
            "http://localhost:9000/public\\images\\avatar\\1633771571405_ticket-tab03.png",
          createdAt: "2021-10-09 09:25:17",
          updatedAt: "2021-10-09 10:25:17",
        },
        {
          name: "Nguyễn Thị Tường Vi",
          email: "tuong-vi@gmail.com",
          password: "10081996",
          phone: "035639675",
          role: "client",
          avatar:
            "http://localhost:9000/public\\images\\avatar\\1633771571405_ticket-tab03.png",
          createdAt: "2021-10-10 11:25:17",
          updatedAt: "2021-10-10 12:25:17",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
  },
};
