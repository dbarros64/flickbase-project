import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../../../Redux/Actions/usersActions';

import {
    Divider,
    Button,
    TextField

} from '@material-ui/core';




const UserProfile = () => {
    const {firstname, lastname, age} = useSelector(state => state.users.data);
    const dispatch = useDispatch();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: { firstname, lastname, age },
        validationSchema: Yup.object({
            firstname: Yup.string()
            .required('This field is required')
            .min(3,'Minimum characters are three')
            .max(10, 'Max characters are 15'),
            lastname: Yup.string()
            .required('This field is required')
            .min(3, 'Minimum characters is three.')
            .max(15, 'Maximum characters are 15.'),
            age: Yup.number()
        }),
        onSubmit: (values, { resetForm }) => {
            dispatch(updateUserProfile(values))
        }
    });


    const errorHelper = (formik, values) => ({
        error:formik.errors[values] && formik.touched[values] ? true : false,
        helperText: formik.errors[values] && formik.touched[values] ? formik.errors[values] : null
    });

    return (
        <>
            <form className='mt-3 article_form' style={{maxWidth: '250px'}} onSubmit={formik.handleSubmit}>
                <div className='form-group'>
                    <TextField 
                        style={{width: '100%'}}
                        name='firstname'
                        label='Enter your firstname'
                        placeholder='Enter your name'
                        variant='outlined'
                        {...formik.getFieldProps('firstname')}
                        {...errorHelper(formik, 'firstname')}
                    />
                </div>
                <div className='form-group'>
                    <TextField 
                        style={{width: '100%'}}
                        name='lastname'
                        label='Enter your lastname'
                        placeholder='Enter your name'
                        variant='outlined'
                        {...formik.getFieldProps('lastname')}
                        {...errorHelper(formik, 'lastname')}
                    />
                </div>
                <div className='form-group'>
                    <TextField 
                        style={{width: '100%'}}
                        name='age'
                        label='Enter your age'
                        placeholder='Enter your name'
                        variant='outlined'
                        {...formik.getFieldProps('age')}
                        {...errorHelper(formik, 'age')}
                    />
                </div>
                <Button
                    className='mb-3'
                    variant='contained'
                    color='primary'
                    type='submit'
                >
                    Update my profile
                </Button>
            </form>
        </>
    )
};


export default UserProfile;