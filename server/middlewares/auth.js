const { User } = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.checkToken = async(req, res, next) => {
    try {
        if (req.headers["x-access-token"]) {
            const accessToken = req.headers["x-access-token"]
            const {_id, email, exp } = jwt.verify(accessToken, process.env.DB_SECRET)

            res.locals.userData = await User.findById(_id);
            next();
        } else {
            next();
        }

    } catch (error) {
        res.status(401).json({ message: "Invalid token", error: error })
    }
};


exports.checkLoggedIn = (req, res, next) => {
    try {
        const user = res.locals.userData;
    if (!user) {
        return res.status(401).json({ message: "User not found", error })
    } else {
        req.user = user;
        next()
    } 
} catch (error) {
    res.status(400).json({ message: "Error logging in", error: error })
}
    
};