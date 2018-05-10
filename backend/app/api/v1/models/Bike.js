// Book.js
'use strict';

import Bookshelf from './../../../../bookshelf';

class Bike extends Bookshelf.Model {

  get tableName() {
    return 'bikes';
  };

};

export default Bookshelf.model('Bike', Bike);