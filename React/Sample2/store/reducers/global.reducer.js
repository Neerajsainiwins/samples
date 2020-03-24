import * as types from '../types';

const initialState = JSON.parse(localGlobalCodes)?JSON.parse(localGlobalCodes) : [];

const globalReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case types.GLOBAL_CODES_STATUS:
            return payload;

        case types.GLOBAL_CODES_OLD:
            return [];

        default:
            return state;
    }
}

export default globalReducer;