import React, { useEffect, useState } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
// import GoogleFontLoader from 'react-google-font-loader';
import Loader from './Utils/Loader';

import { useDispatch, useSelector } from 'react-redux';
import { isAuthUser } from './Redux/Actions/usersActions';

import Home from './Components/Home/Home';
import Header from './Components/Navigation/Header';
import MainLayout from './HOC/MainLayout';
import authGuard from './HOC/AuthGuard';
import Auth from './Components/Auth/Auth';
import Dashboard from './Components/Dashboard/Dashboard'
import Profile from './Components/Dashboard/Profile/Profile';
import Articles from './Components/Dashboard/Articles/Articles';
import AddArticle from './Components/Dashboard/Articles/AddArticle'
import EditArticle from './Components/Dashboard/Articles/EditArticle';
import Article from './Components/Articles/Article';

const Routes = () => {
    const [loading, setLoading] = useState(true);
    const users = useSelector(state => state.users);
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(isAuthUser())
    }, [dispatch]);


    useEffect(() => {
        if (users.auth !== null) {
            setLoading(false)
        }
    }, [users])



    return (
        <BrowserRouter>
            <Header />
            <>
                { loading ? 
                    <Loader />
                :
                    <MainLayout>
                        <Switch>
                            <Route path="/dashboard/articles/add" component={authGuard(AddArticle, true)} />
                            <Route path="/dashboard/articles/edit/:id" component={authGuard(EditArticle, true)} />
                            <Route path="/dashboard/articles" component={authGuard(Articles, true)} />
                            <Route path="/dashboard/profile" component={authGuard(Profile)} />
                            <Route path="/dashboard" component={authGuard(Dashboard)} />
                            <Route path="/article/:id" component={Article} />
                            <Route path="/auth" component={Auth} />
                            <Route path="/" component={Home} />
                        </Switch>
                    </MainLayout>
                }
            </>
            {/* <GoogleFontLoader 
                fonts={[
                    {font: "Roboto", weights: [300, 400, 900]},
                    {font: "Fredoka One"}
                ]}
            /> */}
        </BrowserRouter>
    )
};


export default Routes;