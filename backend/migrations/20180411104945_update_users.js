exports.up = function (knex, Promise) {
    return knex
        .schema
        .createTableIfNotExists('users', (table) => {
            table
                .increments('id')
                .unsigned()
                .primary();
            table
                .string('firstname')
                .notNull();
            table
                .string('lastname')
                .notNull();
            table
                .string('contact')
                .notNull();
            table
                .string('email')
                .notNull();
            table
                .string('password')
                .notNull();
        })
};

exports.down = function (knex, Promise) {
    return knex
        .schema
        .dropTable('users');
};