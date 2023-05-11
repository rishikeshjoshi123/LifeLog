
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cors = require('cors');

// Require dotenv and load environment variables
require('dotenv').config();

//routes management
const appRoutes = require('./routes/appRoutes.js');
const authRoutes = require('./routes/authRoutes.js');



const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kedxy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => {
        console.log('Connected to mongoDB database');
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log('Nodejs sever just started !');
            console.log('Listening in port :', port);
        })
    })
    .catch((err) => {
        console.log(err);
        return;
    });


//to allow all origins to access your API
app.use(cors());
// to read data body from incoming payload
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//enable cookie parser
app.use(cookieParser());

//routes
app.use(authRoutes);
app.use('/', appRoutes);



