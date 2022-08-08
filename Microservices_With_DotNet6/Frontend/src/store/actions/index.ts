
import { LogOut, StoreUserData } from "./auth.actions";
import { StoreGlobalCodes, StoreHeaderModal, StoreLoadingDetail, StoreSideBar, StoreTenantDetail } from "./global.actions";
/********************************************************************************
 *  App Action Creators
 *******************************************************************************/
export type AppActionCreatorTypes = StoreGlobalCodes | StoreUserData | StoreSideBar | StoreHeaderModal | LogOut | StoreTenantDetail | StoreLoadingDetail;


/********************************************************************************
 *  Export all actions
 *******************************************************************************/
export * from './global.actions';
export * from './auth.actions'