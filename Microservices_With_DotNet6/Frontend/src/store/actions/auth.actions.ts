import * as types from "../types";
import IUserDetails from "../../models/interfaces/IUserDetails";


/********************************************************************************
*  Set Auth user detail
*******************************************************************************/
export interface StoreUserData {
    type: typeof types.STORE_USER_DATA,
    payload: IUserDetails
}

export function storeUserData(data: IUserDetails): StoreUserData {
    return {
        type: types.STORE_USER_DATA,
        payload: data
    };
};


/********************************************************************************
*  Set Auth user detail
*******************************************************************************/
export interface LogOut {
    type: typeof types.LOGOUT,
    payload: {}
}

export function logOut(): LogOut {
    return {
        type: types.LOGOUT,
        payload: {}
    };
};


