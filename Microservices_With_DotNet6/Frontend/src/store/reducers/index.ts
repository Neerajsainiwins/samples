/*********************************************************************************************
 * Created Date : 28/02/2022
 * Description : Combine all reducers into root reducer that will used while configuaring store
 **********************************************************************************************/
import { combineReducers } from "redux";
import globalReducer from './global.reducer';
import authReducer from './auth.Reducer';



const rootReducer = combineReducers({
    // The global reducer manages state for global code values.
    global: globalReducer,
    // The auth reducer manages state for authenticated user detials. 
    auth: authReducer
 
   
});


export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
