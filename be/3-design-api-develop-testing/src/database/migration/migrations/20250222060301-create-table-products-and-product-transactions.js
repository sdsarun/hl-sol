'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS products (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at timestamptz
      );

      CREATE TABLE IF NOT EXISTS product_transalations (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id uuid NOT NULL,
        name varchar(255) NOT NULL,
        description TEXT,
        language varchar(2) NOT NULL,
        created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at timestamptz,

        FOREIGN KEY (product_id) REFERENCES products (id)
      );
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("product_transalations");
    await queryInterface.dropTable("products");
  }
};
