import { combineReducers } from 'redux';

import authReducer from './auth.reducer';
import alertReducer from './alert.reducer';
import sortReducer from './sort.reducer';
import globalReducer from './global.reducer';

const rootReducer = combineReducers({
    alert: alertReducer,
    auth: authReducer,
    sorting: sortReducer,
    global: globalReducer
});


export default rootReducer;