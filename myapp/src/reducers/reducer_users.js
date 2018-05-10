export default function UsersReducers(state=null, action) {
    switch (action.type) {
        case 'ACTION_TYPE':
            return action.payload;
        
        default:
           return state;
}
}