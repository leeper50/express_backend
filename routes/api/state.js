const express = require('express');
const router = express.Router();

let shared_obj = {
    name: "name1",
    id: 100,
    gpa: 4.0
};

/**
 * This function will allow the user to load their game's state
 * The state will be returned as a json object
 */
router.get('/', async(req, res) => {
    // res.setHeader('Content-Type', 'application/json');
    // res.send(JSON.stringify(testobj));
    // shared_obj = testobj;
    res.json(shared_obj);
});

/**
 * This function will allow the user to save their game's state
 * The state should be sent as a json object
 */
 router.post('/', async(req, res) => {
    shared_obj.id = req.body.id;
    shared_obj.gpa = req.body.gpa;
    res.json(shared_obj)
});

module.exports = router;