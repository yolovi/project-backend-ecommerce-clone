"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Categories", [
      {
        name_category: "Wall Lamps",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name_category: "Pendant Lamps",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name_category: "Ceiling Lights",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name_category: "Floor Lamp",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};
