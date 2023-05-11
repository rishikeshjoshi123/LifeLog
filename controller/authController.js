
const jwt = require('jsonwebtoken');
const User = require('../model/user.js');


module.exports.signup = async (req, res) => {

    const { email, password } = req.body;
    try {
        //create a new user and save in db
        const user = await User.signup(email, password);
        //User authenticated -> Create JWT and send back 
        const token = createJWTtoken(user._id);
        //send the jwt token in cookie
        res.cookie('jwt', token, { httpOnly: true });
        //redirect to Homepage
        res.sendStatus(201);
    }
    catch (err) {
        const error = handleError(err);
        res.status(400).json(error);
    }
}
module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        //User authenticated -> Create JWT and send back
        const token = createJWTtoken(user._id);
        //send the jwt token in cookie
        res.cookie('jwt', token, { httpOnly: true });
        //redirect to HOMEPAGE/dashboard
        res.sendStatus(200);
    }
    catch (err) {
        const error = handleError(err);
        res.status(400).json(error);
    }
};
module.exports.logout = async (req, res) => {
    res.clearCookie('jwt').sendStatus(200);
}


function createJWTtoken(userId) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}
function handleError(err) {
    let E = { 'email': '', 'password': '' };
    //Login errors
    if (err.message.includes('Invalid login email')) E['email'] = 'Please Enter a valid email.';
    if (err.message.includes('Invalid login password')) E['password'] = 'Please Enter a valid password.';
    //Signup Errors
    if (err.message.includes('email: Please enter a valid email')) E['email'] = 'Please Enter a valid email.';
    if (err.message.includes('password: Password should be min 6 characters long')) E['password'] = 'Password should me min 6 char long.';
    if (err.message.includes('E11000')) E['email'] = 'User name already exist.';

    return E;
}