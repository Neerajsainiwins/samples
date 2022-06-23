import { AppActionCreatorTypes } from "../actions";
import * as types from "../types";
const initialState: any = {};

const globalReducer = (state: any = initialState, actions: AppActionCreatorTypes) => {
    switch (actions.type) {
        case types.STORE_GLOBAL_CODES:
            return { ...state, codes: actions.payload }
        case types.STORE_SIDEBAR:
            return { ...state, sidebar: actions.payload }
        case types.STORE_HEADER_MODAL:
            return { ...state, currentHeaderModal: actions.payload }
        case types.STORE_TENANT_DETAIL:
            return { ...state, tenantDetail: actions.payload };
        case types.STORE_LOADING:
            return { ...state, loading: actions.payload };
        default:
            return state;
    }
}
export default globalReducer;
