// Owner.js
'use strict';

import Bookshelf from './../../../../bookshelf';

class Owner extends Bookshelf.Model {

  get tableName() {
    return 'owner';
  };
};

export default Bookshelf.model('Owner', Owner);