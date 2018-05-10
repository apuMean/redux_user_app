exports.up = function (knex, Promise) {
  return knex
    .schema
    .createTable('owner', (table) => {
      table
        .increments('id')
        .unsigned()
        .primary();
      table
        .string('name')
        .notNull();
      table
        .string('surname')
        .notNull();
      table
        .string('address')
        .notNull();
      table
        .string('phone')
        .notNull();
      table
        .string('email')
        .notNull();
    })
};

exports.down = function (knex, Promise) {
  return knex
    .schema
    .dropTable('owner');
};