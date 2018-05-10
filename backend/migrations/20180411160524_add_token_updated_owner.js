exports.up = function (knex, Promise) {
    return knex.schema.table('updated_owner', function (t) {
        t.string('token');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table('updated_owner', function (t) {
        t.dropColumn('token');
    });
};