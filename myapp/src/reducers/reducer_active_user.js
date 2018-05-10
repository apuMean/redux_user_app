export default function (state = null, action) {

    switch (action.type) {
        case 'SELECTED_USER':
            return action.payload;
    
        default:
			return state;
    
    }
}