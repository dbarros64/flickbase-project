import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';

import SideDrawer from './SideNavigation';
import { useSelector, useDispatch } from 'react-redux';
import { clearNotification } from '../../Redux/Actions/index';
import { showToast } from '../../Utils/Tools';
import { signOut } from '../../Redux/Actions/usersActions';
import { appLayout } from '../../Redux/Actions/siteActions';


const Header = (props) => { 
    const notifications = useSelector(state => state.notifications)
    const users = useSelector(state => state.users);
    const [layout, setLayout] = useState('');
    const dispatch = useDispatch();

    const signOutUser = () => {
       dispatch(signOut())
       props.history.push('/')
    };

    useEffect(() => {
        let pathArray = props.location.pathname.split('/');
        if (pathArray[1] === 'dashboard') {
            setLayout('dash_layout')
            dispatch(appLayout('dash_layout'))
        } else {
            setLayout('')
            dispatch(appLayout(''))
        }

    }, [props.location.pathname, dispatch])

    useEffect(() => {
        if (notifications && notifications.error) {
            const msg = notifications.msg ? notifications.msg : "Error"
            showToast("ERROR", msg)
            dispatch(clearNotification());
        }
        if (notifications && notifications.success) {
            const msg = notifications.msg ? notifications.msg : 'Success'
            showToast("SUCCESS", msg)
        }
    }, [notifications, dispatch])

    return (
        <>
            <nav className={`navbar fixed-top ${layout}`}>
                <Link style={{ fontFamily: "Fredoka One"}} to="/" 
                    className='navbar-brand d-flex align-items-center'
                >
                    Flickbase
                </Link>
                <SideDrawer users={users} signOutUser={signOutUser} />
            </nav>
        </>
    )
};


export default withRouter(Header);