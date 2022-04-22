const express = require('express');
let router = express.Router();
require('dotenv').config();
const { checkLoggedIn } = require('../../middlewares/auth');
const { grantAccess } = require('../../middlewares/rolesMiddleware');

const { User } = require('../../models/userModel');

router.route("/register")
.post(async (req, res) => {
    try {

        if (await User.emailTaken(req.body.email)) {
            return res.status(400).json({ message: "This email has been taken. Please try again." })
        }

        const user = new User({
            email: req.body.email,
            password: req.body.password
        });

        const token = user.generateToken()
        const doc = await user.save();

        res.cookie('x-access-token', token)
        .status(200).send(getUserProps(doc))

    } catch (error) {
        res.status(400).json({ message: 'error', error: error })
        console.log(error);
    }
});


router.route("/signin")
.post(async (req, res) => {
    try {
        /// FIND USER
        let user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(400).json({ message: "User or email not found" })

        // COMPARE PASSWORD
        const compare = await user.comparePassword(req.body.password)
        if (!compare) return res.status(400).json({ message: "Error logging in. Pls try again" })

        // GENERATE TOKEN
        const token = user.generateToken()

        // SEND RESPONSE  
        res.cookie('x-access-token', token)
        .status(200).send(getUserProps(user))

    } catch (error) {
        res.status(400).json({ message: "Error", error: error })
    }
});


router.route("/profile")
.get(checkLoggedIn, grantAccess('readOwn', 'profile'), async (req, res) => {
    try {

        const permission = res.locals.permission
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(400).json({ message: "User or email not found" })
        } else {
            res.status(200).json(permission.filter(user._doc))
        }
       
    } catch (error) {
        res.status(400).send(error);
    }
})
.patch(checkLoggedIn, grantAccess('updateOwn', 'profile'), async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            {_id: req.user._id},
            {
                "$set": {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    age: req.body.age
                }
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "user not found." })
        } else {
            res.status(200).json(getUserProps(user))
        }

    } catch (error) {
        res.status(400).json({ message: "Issue with updating", error: error })
    }
});

router.route("/isauth")
.get(checkLoggedIn, async (req, res) => {
    res.status(200).send(getUserProps(req.user))
});

router.route('/update_email')
.patch(checkLoggedIn, grantAccess('updateOwn', 'profile'), async (req, res) => {
    try {

        if (await User.emailTaken(req.body.newemail)) {
            return res.status(400).json({ message: "Sorry, this email is taken. Please try again." })
        }

        const user = await User.findOneAndUpdate(
            {_id: req.user._id, email: req.body.email},
            {
                "$set": {
                    email: req.body.newemail
                }
            },
            {new: true}
        );

        if (!user) {
            return res.status(400).json({ message: "Sorry, user is not found." })
        }

        const token = user;
        res.cookie('x-access-token', token)
        .status(200).send({email: user.email })

    } catch (error) {
        res.status(400).json({ message: "error updating email", error: error })
    }
})

const getUserProps = (user) => {
    return{
        _id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        age: user.age,
        role: user.role
    }  
}

module.exports = router;