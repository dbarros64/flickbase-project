import { AUTH_USER, SIGN_OUT, CHANGE_USER_EMAIL, UPDATE_USER_PROFILE } from '../types';

const INITIAL_USER_STATE = {
    data: {
        _id: null,
        email: null,
        firstname: null,
        lastname: null,
        age: null,
        role: null
    },
    auth: null
}

export default function usersReducer(state=INITIAL_USER_STATE, action){
    switch(action.type){
        case AUTH_USER:
            return {
                ...state,
                data: { ...state.data, ...action.payload.data},
                auth: action.payload.auth
            }
        case SIGN_OUT:
            return {
                ...state, 
                ...INITIAL_USER_STATE,
                auth: false
            }
        case CHANGE_USER_EMAIL:
            return {
                ...state,
                data: { ...state.data,email: action.payload}
            }
        case UPDATE_USER_PROFILE:
            return {
                ...state,
                data: {...action.payload}
            }
        default:
            return state
    };
};