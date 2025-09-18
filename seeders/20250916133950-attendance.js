"use strict";

const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert("attendance", [
      {
        id: uuidv4(),
        user_id: "johndoe-123",
        date: "2025-09-14",
        time_in: "08:30:23",
        time_out: "16:51:24",
        photo_in_url: "uploads/work-from-home.jpg",
        photo_out_url: "uploads/work-from-home-2.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        user_id: "johndoe-123",
        date: "2025-09-15",
        time_in: "08:25:15",
        time_out: "17:31:24",
        photo_in_url: "uploads/work-from-home-2.jpg",
        photo_out_url: "uploads/work-from-home.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
