const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { json } = require('express/lib/response');

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
    console.log('/state GET called');
    let exist_query = `SELECT gamestate FROM user_information WHERE user_name = '${req.body.username}'`;
    await con.query(exist_query, function(err, result) {
        if (err) {
            res.status(400).json({status: 400, msg: "username not found"});
            throw err;
        }

        res.send(result[0].gamestate);
    });
});

/**
 * This function will allow the user to save their game's state
 * The json passed to the method must have a username field
 * The state should be sent as a json object
 */
 router.post('/', async(req, res) => {
    let gamestate = JSON.stringify(req.body)
    console.log('/state POST called');
    let exist_query = `UPDATE user_information SET gamestate = '${gamestate}' WHERE user_name = '${req.body.username}'`;
    await con.query(exist_query, function(err, result) {
        console.log()
        if (err) {
            res.status(400).json({status: 400, msg: "username not found"});
            throw err;
        }
        res.json(result[0]);
    });
});

module.exports = router;