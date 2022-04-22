import React from 'react';
import AdminLayout from '../../../HOC/AdminLayout';
import AuthProfile from './AuthProfile';
import UserProfile from './UserProfile';


const Profile = () => {
    return (
        <AdminLayout section="Profile">
            <AuthProfile />
            <UserProfile />
        </AdminLayout>
    )
};


export default Profile;