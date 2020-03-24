
import { createStore, applyMiddleware, compose } from 'redux';
import reduxImmutableStateInvariant from "redux-immutable-state-invariant";
import thunk from 'redux-thunk'; 
import signalRMiddleware from './middleware/signalRRegistration';


import rootReducer from './reducers';
import { globalCodesStatus } from './actions';



const middleware = [thunk, reduxImmutableStateInvariant()];

const enhancers =
  process.env.react_app_node_env === "production"
    ? applymiddleware(...middleware):compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()      
    );

const store = createStore(
    rootReducer,
    enhancers,
    console.log('Option selected:',process.env.REACT_APP_NODE_ENV )
);
export default store;