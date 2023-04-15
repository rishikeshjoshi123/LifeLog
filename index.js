const express = require('express');
const mongoose = require('mongoose');

const app = express();

const dbURI = 'mongodb+srv://test_user:1234@cluster0.kedxy.mongodb.net/lifeLog?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => {
        console.log('Connected to mongoDB database');
        app.listen(process.env.PORT || 3000, () => {
            console.log('Nodejs sever just started !');
        })
    })
    .catch(err){
    console.log(err);
}


app.get('/', (req, res) => {
    res.send('Hello app front page');
})

