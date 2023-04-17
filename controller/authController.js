const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../model/user.js');





module.exports.login_post = (req, res) => {

    // const { email, password } = req.body;

    // try{

    // }
    // catch(err){
    //     console.log('Error: at /login endpoint', err);
    //     res.status(400).send(err);
    // }
};


module.exports.signup_post = async (req, res) => {

    const { email, password } = req.body;
    console.log('password received from body', password);

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
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPass = await bcrypt.hash(password, salt);
        console.log('password after hash', hashedPass);

        //create a new user and save in db
        const newUser = new User({ email, password: hashedPass });
        const savedUser = await newUser.save();
        console.log('savedUser obj ', savedUser);

        //create and sign a JWT token
        const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        //send the jwt token in cookie
        res.cookie('jwt', token, { httpOnly: true }).sendStatus(201);

    }
    catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}