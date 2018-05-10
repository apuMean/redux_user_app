import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
const configStore  = configureStore();
ReactDOM.render(<Provider store ={configStore}>
  		<App />
		  </Provider>
  	, document.getElementById('root'));


