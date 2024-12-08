import { combineReducers } from 'redux';
// Import other reducers as needed
import { LOGOUT } from '../actionType';
const appReducer = combineReducers({

});

const rootReducer = (state, action) => {
    if (action.type === LOGOUT) {
        state = undefined; // Reset the state
    }
    return appReducer(state, action);
};

export default rootReducer;
