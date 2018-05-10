import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';

const createstorewithapplymiddleware = applyMiddleware(
	thunk
)(createStore)

export default function configureStore(initialState){

	return createstorewithapplymiddleware(
		rootReducer
		// initialState,applyMiddleware(),
	);

}
