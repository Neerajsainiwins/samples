
const appMiddleware = ({ dispatch, getState }) => next => action => {
    next(action);
};

export default appMiddleware;
