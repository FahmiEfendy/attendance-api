"use strict";

const bcrypt = require("bcrypt");
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

    await queryInterface.bulkInsert("user", [
      {
        id: uuidv4(),
        username: "account_hr",
        password: await bcrypt.hash("accounthr123@", 10),
        role: "hr",
        full_name: "Human Resource",
        email: "hr@example.com",
        phone: "081231231234",
        department: "hr",
        position: "director",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: "johndoe-123",
        username: "johndoe",
        password: await bcrypt.hash("johndoe123@", 10),
        role: "employee",
        full_name: "John Doe",
        email: "john_doe@example.com",
        phone: "083213214321",
        department: "it",
        position: "staff",
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
