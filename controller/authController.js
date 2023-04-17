const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../model/user.js');

const createJWTtoken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}
const hashPass = async (pass) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPass = await bcrypt.hash(pass, salt);
    return hashedPass;
}

module.exports.login_post = async (req, res) => {

    const { email, password } = req.body;

    try {

        //If username exist in db
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            res.status(400).json({
                "email": "The username does not exist!. Try Signup.",
                "password": ""
            });
            return;
        }
        //compare password
        const match = await bcrypt.compare(password, existingUser.password);
        if (!match) {
            res.status(400).json({
                "email": "",
                "password": "Invalid password."
            });
            return;
        }



        //User authenticated -> Create JWT and send back 
        const token = createJWTtoken(existingUser._id);

        //send the jwt token in cookie
        res.cookie('jwt', token, { httpOnly: true });

        //redirect to HOMEPAGE/dashboard
        res.sendStatus(200);

    }
    catch (err) {
        console.log('Error: at /login endpoint', err);
        res.status(400).send(err);
    }
};


module.exports.signup_post = async (req, res) => {

    const { email, password } = req.body;

    try {
        //If email is incorrect
        if (!validator.isEmail(email)) {

            res.status(400).json({
                "email": "The email is invalid!",
                "password": ""
            });
            return;
        }

        //If username already exist in db
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                "email": "The username already exist!. Try Login.",
                "password": ""
            });
            return;
        }

        //Hash password
        const hashedPass = await hashPass(password);

        //create a new user and save in db
        const newUser = new User({ email, password: hashedPass });
        const savedUser = await newUser.save();

        //User authenticated -> Create JWT and send back 
        const token = createJWTtoken(newUser._id);

        //send the jwt token in cookie
        res.cookie('jwt', token, { httpOnly: true });

        //redirect to Homepage
        res.sendStatus(201);

    }
    catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}