/*********************************************************************************************
 * Created Date : 28/02/2022
 * Description : Configure store for application by proving root reducer.
 **********************************************************************************************/

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
// Package used for persist store data when page is refershed.
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import appMiddleware from "./middleware/app.middleware";
import * as env from '../config/env.config';
import { composeWithDevTools } from "redux-devtools-extension";

// set persist configutation 
const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: [
    // Define reducers those data need to be retain after refersh of page.
    "global",
    "auth"
  ],
};



const persistedReducer = persistReducer(persistConfig, rootReducer);

const configureStore = () => {
  const middleware = [thunk, appMiddleware];
  // redux devtools
  const enhancers =
    (env.NODE_ENV === "production")
      ? applyMiddleware(...middleware)
      :
      compose(composeWithDevTools(applyMiddleware(...middleware)));
  // create redux store
  const store = createStore(persistedReducer, enhancers);
  let persistor = persistStore(store);
  return { store, persistor };
};

export default configureStore;
