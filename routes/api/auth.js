const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mysql = require('mysql');

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

router.get('/', (req, res) => {
    res.send('Read the README.html in the public folder to learn how to use');
});

/**
 * This function will take a post request with email,username, and password fields
 * After successful registration, the user may register another, or move to the login page
 * Failure will result in a re-registration occuring
 */
 router.post('/register', async (req, res) => {
    let exist_query = `SELECT 1 FROM user_information WHERE user_name = '${req.body.username}'`;
    let user_exists = false;
    await con.query(exist_query, function(err, result) {
        if (err) throw err;
        if (typeof result[0] != 'undefined')
            user_exists = true;

        try {
            if (user_exists == false) {
                let hashPassword = bcrypt.hashSync(req.body.password, 10);
                let newUser = {
                    username: req.body.username,
                    password: hashPassword,
                };

                let query = `INSERT INTO user_information (user_name,user_password,user_email,user_code,gamestate) ` +
                `VALUES ('${newUser.username}','${newUser.password}','default@example.com',left(uuid(), 8),'{}');`;

                con.query(query, function(err, result) {
                    if (err) throw err;
                    console.log(`${newUser.username} has been added.`);
                });
                res.status(200).json({status: 200, msg : "User created"});
            } else {
                res.status(400).json({status: 400, msg : "User exists"});
            }
        } catch {
            res.status(400).json({status: 400, msg : "Request format error"});
        }
    });
});

/**
 * This function will take a post request with email and password fields
 * After successful authentication, the user will move to their home page
 * Failure will result in a relogin attempt
 */
router.post('/login', async (req, res) => {
    try {
        let storedPass;
        let query = `SELECT * FROM user_information WHERE user_name = '${req.body.username}'`;
        
        await con.query(query, function(err, result) {
            // If fires when user does not exist
            if (result[0] == undefined) {
                res.status(400).json({ msg: 'User does not exist'})
            } 
            else {
                storedPass = result[0].user_password;
                const passwordMatch = bcrypt.compareSync(req.body.password, storedPass);
                if (passwordMatch) {
                    res.status(200).json({ status: 200, msg: 'User is logged in'})
                }
                else {
                    res.status(400).json({ status: 400, msg: 'Incorrect password'})
                }
            }
        });
    } catch {
        res.status(400).json({ status: 400, msg: 'Request format error'})
    }
});


module.exports = router;