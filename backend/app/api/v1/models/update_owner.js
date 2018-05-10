// updated Owner.js
'use strict';

import Bookshelf from './../../../../bookshelf';

class updateOwner extends Bookshelf.Model {

    get tableName() {
        return 'updated_owner';
    };
};

export default Bookshelf.model('updateOwner', updateOwner);