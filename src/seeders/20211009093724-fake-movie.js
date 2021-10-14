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
      "Movies",
      [
        {
          movieName: "The Longest Ride",
          trailer: "https://www.youtube.com/embed/FUS_Q7FsfqU",
          poster: "thelongestride.jpg",
          description:
            "After an automobile crash, the lives of a young couple intertwine with a much older man, as he reflects back on a past love.",
          releaseDate: "2019-07-29 00:00:00",
          rating: 10,
          createdAt: "2021-10-10 12:25:17",
          updatedAt: "2021-10-10 12:25:17",
        },
        {
          movieName: "The Walking Dead",
          trailer: "https://www.youtube.com/embed/R1v0uFms68U",
          poster: "thewalkingdead.jpg",
          description:
            "Sheriff's Deputy Rick Grimes leads a group of survivors in a world overrun by zombies.Sheriff's Deputy Rick Grimes leads a group of survivors in a world overrun by zombies.",
          releaseDate: "2021-10-08 12:32:49",
          rating: 8,
          createdAt: "2021-10-10 12:25:17",
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
    await queryInterface.bulkDelete("Movies", null, {});
  },
};
