const express = require('express');
const router = express.Router();

const db = require('../model/appData.js');

//auth middleware
const { auth } = require('../middleware/authMiddleware.js');


router.get('/', auth, async (req, res) => {
    try {
        const data = await db.find();
        res.json(data);
    }
    catch (err) {
        res.status(500).send(err);
    }
})

router.post('/', async (req, res) => {

    try {

        const newData = new db(req.body);
        const savedData = await newData.save();
        res.json(savedData);
    }
    catch (err) {
        res.status(500).send(err);
    }
})

router.put('/:id', async (req, res) => {

    try {
        const updatedData = await db.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        res.json(updatedData);
    }
    catch (error) {
        res.status(500).send(error);
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const deletedData = await db.findOneAndDelete({ _id: req.params.id });
        res.json(deletedData);
    }
    catch (error) {
        res.status(500).send(error);
    }
})

router.use((req, res) => {
    res.json({ "Error": "This is 404 page" });
})



module.exports = router;