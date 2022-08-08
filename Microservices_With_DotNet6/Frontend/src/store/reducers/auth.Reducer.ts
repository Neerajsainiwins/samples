import * as types from "../types";
import IUserDetails from "../../models/interfaces/IUserDetails";
import { AppActionCreatorTypes } from "../actions";

const initialState: IUserDetails = { 
    userData: {}
}
const authReducer = (state: any = initialState, actions: AppActionCreatorTypes) => {
    switch (actions.type) {
        case types.STORE_USER_DATA:
            return { ...state, userData: actions.payload }
        case types.LOGOUT:
            return { ...state, userData: actions.payload }
        default:
            return state;
    }
}
export default authReducer;











