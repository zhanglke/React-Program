//import {createStore} from 'react-redux';
//import createStore from 'react-redux'
import reducer from './reducer';
import {createStore} from 'redux'

const store = createStore(reducer);

export default store;