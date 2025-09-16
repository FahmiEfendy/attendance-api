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
        username: "admin",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
        full_name: "System Administrator",
        email: "admin@example.com",
        phone: "08123456789",
        department: "IT",
        position: "Admin",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        username: "johndoe",
        password: await bcrypt.hash("johndoe123", 10),
        role: "employee",
        full_name: "John Doe",
        email: "john@example.com",
        phone: "08121234567",
        department: "Finance",
        position: "Staff",
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
