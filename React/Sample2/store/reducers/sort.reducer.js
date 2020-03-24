import * as types from '../types';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_SORT_PARAMS:
      return { ...state, sortParams: action.payload.data };
    default:
      return state;
  }
};
