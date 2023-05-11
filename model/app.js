const mongoose = require('mongoose');

const dayData = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
    },
    wakeUpTime: {
        type: Date,
        required: true
    },
    sleepTime: {
        type: Date,
        required: true
    },
    dayDescription: {
        type: String,
        required: true
    },
    yogaDescription: {
        type: String,
        required: true
    }

}, { timestamps: true });

const db = mongoose.model('dayLoggerCollection', dayData);
module.exports = db;