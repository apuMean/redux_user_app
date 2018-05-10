var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './dev.sqlite3', // Database file for sqlite3 only
    },
    useNullAsDefault: false //For removing waring from console for default value assign
});
var bookshelf = require('bookshelf')(knex);
bookshelf.plugin('registry');

export default bookshelf;