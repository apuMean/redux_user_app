import { combineReducers } from 'redux';
import UsersReducers from './reducer_users';
import activeUser from './reducer_active_user';
const rootReducer = combineReducers({

    users: UsersReducers,
    activeUser: activeUser
})

export default rootReducer;
