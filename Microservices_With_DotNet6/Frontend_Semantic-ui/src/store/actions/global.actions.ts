import { IGlobalCode, IHeaderModal, ILoading, ISideBar, ITenenatDetail } from "../../models/interfaces/IGlobalCode";
import * as types from "../types";

/********************************************************************************
*  Set Global Code
*******************************************************************************/
export interface StoreGlobalCodes {
    type: typeof types.STORE_GLOBAL_CODES,
    payload: IGlobalCode
}

export function storeGlobalCodes(data: IGlobalCode): StoreGlobalCodes {
    return {
        type: types.STORE_GLOBAL_CODES,
        payload: data
    };
};


/********************************************************************************
*  Set Side bar
*******************************************************************************/
export interface StoreSideBar {
    type: typeof types.STORE_SIDEBAR,
    payload: ISideBar
}

export function storeSideBar(data: ISideBar): StoreSideBar {
    return {
        type: types.STORE_SIDEBAR,
        payload: data
    };
};

/********************************************************************************
*  Set Side bar
*******************************************************************************/

export interface StoreHeaderModal {
    type: typeof types.STORE_HEADER_MODAL,
    payload: IHeaderModal
}

export function storeHeaderModal(data: IHeaderModal): StoreHeaderModal {
    return {
        type: types.STORE_HEADER_MODAL,
        payload: data
    };
};


/********************************************************************************
*  Set Tenant Detail
*******************************************************************************/
export interface StoreTenantDetail {
    type: typeof types.STORE_TENANT_DETAIL,
    payload: ITenenatDetail
}

export function storeTenantDetail(data: ITenenatDetail): StoreTenantDetail {
    return {
        type: types.STORE_TENANT_DETAIL,
        payload: data
    };
};


export interface StoreLoadingDetail {
    type: typeof types.STORE_LOADING,
    payload: ILoading
}

export function storeLoadingDetail(data: ILoading): StoreLoadingDetail {
    return {
        type: types.STORE_LOADING,
        payload: data
    };
};

