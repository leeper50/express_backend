const express = require('express');
const router = express.Router();
const mysql = require('mysql');

router.use(express.json());

var con = mysql.createConnection({
    host: "10.0.0.93",
    user: "walter",
    password: "password",
    database: "project_database"
});

con.connect( function(err) {
    if (err) {
        console.log("Database configuration incorrect!");
        throw err;
    }
    else
        console.log("Database connection established!");
});

/**
 * This function will allow the user to load their game's state
 * The state will be returned as a json object
 */
router.get('/', async(req, res) => {
    let exist_query = `SELECT gamestate FROM user_information WHERE user_name = '${req.body.username}'`;
    await con.query(exist_query, function(err, result) {
        if (result[0] == undefined) {
            res.status(400).json({ msg: 'User does not exist'})
        } 
        else {   
            res.status(200).send(result[0].gamestate);
        }
    });
});

/**
 * This function will allow the user to save their game's state
 * The json passed to the method must have a username field
 * The state should be sent as a json object
 */
 router.post('/', async(req, res) => {
    let gamestate = JSON.stringify(req.body)
    let exist_query = `UPDATE user_information SET gamestate = '${gamestate}' WHERE user_name = '${req.body.username}'`;
    await con.query(exist_query, function(err, result) {
        if (result.message.includes("(Rows matched: 0")) {
            res.status(400).json({ msg: 'User does not exist'})
        } 
        else {
            res.status(200).json({ msg: "User\'s gamestate was updated"})
        }
    });
});

module.exports = router;