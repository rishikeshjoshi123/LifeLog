const express = require('express');
const app = express();

const appRoutes = require('./routes/appRoutes.js');

const mongoose = require('mongoose');


const dbURI = 'mongodb+srv://test_user:TaIhHwdYhvLtRXNO@cluster0.kedxy.mongodb.net/dayLogDB?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => {
        console.log('Connected to mongoDB database');
        app.listen(process.env.PORT || 3000, () => {
            console.log('Nodejs sever just started !');
        })

        // get the current database name
        const dbName = mongoose.connection.db.databaseName;
        console.log(`Connected to database: ${dbName}`);

        // get the model names
        const modelNames = mongoose.modelNames();
        console.log(`Models registered: ${modelNames}`);
    })
    .catch((err) => {
        console.log(err);
        return;
    });


// to read data from payload
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', appRoutes);



