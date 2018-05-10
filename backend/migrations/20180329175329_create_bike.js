exports.up = function (knex, Promise) {
  return knex
    .schema
    .createTable('bikes', (table) => {
      table
        .increments('id')
        .unsigned()
        .primary();
      table
        .string('nameOfbike')
        .notNull();
      table
        .string('location')
        .notNull();
    })
};

exports.down = function (knex, Promise) {
  return knex
    .schema
    .dropTable('bikes');
};