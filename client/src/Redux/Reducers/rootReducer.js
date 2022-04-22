import { combineReducers } from "redux";

import articles from './articlesReducer';
import users from './usersReducer';
import site from './siteReducer';
import notifications from './notificationReducer';

const rootReducer = combineReducers({
    articles,
    users,
    site,
    notifications
})


export default rootReducer;