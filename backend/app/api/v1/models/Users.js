// Users.js
'use strict';

import Bookshelf from './../../../../bookshelf';

class Users extends Bookshelf.Model {

  get tableName() {
    return 'users';
  };
};

export default Bookshelf.model('Users', Users);