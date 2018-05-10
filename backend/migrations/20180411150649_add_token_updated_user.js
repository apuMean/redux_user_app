exports.up = function (knex, Promise) {
    return knex.schema.table('updated_user', function (t) {
        t.string('token');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table('updated_user', function (t) {
        t.dropColumn('token');
    });
};