import * as users from './index';
import axios from 'axios';
import { getAuthHeader, removeTokenCookie, getTokenCookie } from '../../Utils/Tools';


axios.defaults.headers.post['Content-Type'] = 'application/json';


export const registerUser = (values) => {
    return async (dispatch) => {
        try {
            const user = await axios.post(`/api/users/register`, {
                email: values.email,
                password: values.password
            });

            dispatch(users.authUser({ data: user.data, auth: true }))
            dispatch(users.successGlobal('Welcome!'))
        } catch (error) {
            
            dispatch(users.errorGlobal(error.response.data.message))
        }
    }
};

export const signInUser = (values) => {
    return async (dispatch) => {
        try {
            const user = await axios.post(`/api/users/signin`, {
                email: values.email,
                password: values.password
            });
    
            dispatch(users.authUser({ data: user.data, auth: true }))
            dispatch(users.successGlobal('Welcome back!'))
        } catch (error) {
            console.log(error.response.data.message);
            dispatch(users.errorGlobal(error.response.data.message))
        };
     
    }
};

export const isAuthUser = () => {
    return async (dispatch) => {

        try {
            if (!getTokenCookie()) {
                throw new Error()
            }
            const user = await axios.get(`/api/users/isauth`, getAuthHeader());

            dispatch(users.authUser({ data: user.data, auth: true }))
        } catch (error) {
            dispatch(users.authUser({ data: {}, auth: false }))
        }
    }
};


export const signOut = () => {
    return async (dispatch) => {
        removeTokenCookie()
        dispatch(users.signOut())
    }
};


export const changeUserEmail = (data) => {
    return async (dispatch) => {
        try {
            await axios.patch(`/api/users/update_email`, {
                email: data.email,
                newemail: data.newemail
            }, getAuthHeader())

            dispatch(users.changeUserEmail(data.newemail))
            dispatch(users.successGlobal('Your email has been updated.'))

        } catch (error) {
            dispatch(users.errorGlobal(error.response.data.message))
        };
    }
};



export const updateUserProfile = (data) => {
    return async (dispatch, getState) => {
        try {

            const profile = await axios.patch(`/api/users/profile`, data, getAuthHeader())

            const userdata = {
                ...getState().users.data,
                ...profile.data
            }

            dispatch(users.updateUserProfile(userdata))

            dispatch(users.successGlobal('Your profile has been updated.'))

        } catch (error) {
            dispatch(users.errorGlobal(error.response.data.message))
        }
    }
};

