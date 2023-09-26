import {combineReducers} from 'redux';
import appReducer from './reducer.js';

const rootReducer = combineReducers ({
    data: appReducer
});

export default rootReducer;