// updated Owner.js
'use strict';

import Bookshelf from './../../../../bookshelf';

class updateUser extends Bookshelf.Model {

    get tableName() {
        return 'updated_user';
    };
};

export default Bookshelf.model('updateUser', updateUser);