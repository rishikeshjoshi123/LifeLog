const jwt = require('jsonwebtoken');
const User = require('../model/user.js');

const auth = async (req, res, next) => {
    const jwtToken = req.cookies.jwt;

    try {
        if (jwtToken) {
            let userId = null;
            jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decodedToken) => {
                if (err) {
                    console.log('JWT verification failed. The key is invalid. [Moving forward as of now]');
                    //From here redirect to the login page
                }
                else {
                    userId = decodedToken.userId;
                    console.log('JWT verification successful. The decoded key is ', decodedToken);
                    // next() from here...
                }

            })
            //'user' object of 'res.locals.user' can be used later after the next() is called.
            if (userId) {
                const user = await User.findById(userId);
                res.locals.user = user;
            }
            else console.log('userId is null', userId);
        }
        else {
            console.log('The JWT token doesnt exist! [Moving forwared as of now]');
        }


        //As of now all the requests are allowed to move forward.
        next();
    }
    catch (err) {
        console.log(err);
        res.status(401).send(err);
    }
}

module.exports = { auth };