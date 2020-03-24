import * as types from "../types";

export const globalCodesStatus = (data) => {
    return { type: types.GLOBAL_CODES_STATUS, payload: data };
};

export const globalCodesOld = () => {
    return { type: types.GLOBAL_CODES_OLD, payload: {} }
};
