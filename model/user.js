const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter email.'],
        unique: true, lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter password.'],
        minLength: [6, 'Password should be min 6 characters long.']
    }
});


//Mongoose Hook: Used to do something before or after a event
//Here we are doing Hashing before the 'save' event occurs
userSchema.pre('save', async function (next) {

    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (err) {
        next(err);
    }
})

//Mongoose static function
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("Invalid login email");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid login password");
    return user;
}
userSchema.statics.signup = async function (email, password) {
    const user = await new this({ email, password }).save(); // create a new user and save
    return user;
}

const User = mongoose.model('user', userSchema);
module.exports = User;