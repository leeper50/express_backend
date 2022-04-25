const express = require('express');
const http = require('http');
const bcrypt = require('bcrypt');
const path = require("path");
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { hasUncaughtExceptionCaptureCallback } = require('process');
const { query } = require('express');

var con = mysql.createConnection({
    host: "10.0.0.93",
    user: "walter",
    password: "password",
    database: "project_database"
});

con.connect( function(err) {
    if (err) throw err;
    console.log("Database connection established!");
});

let port = 9000
const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'));
});

/**
 * This function will take a post request with email,username, and password fields
 * After successful registration, the user may register another, or move to the login page
 * Failure will result in a re-registration occuring
 */
app.post('/register', async (req, res) => {
    console.log("register called")
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
    
                let query = `INSERT INTO user_information (user_name,user_password,user_email,user_code) ` +
                `VALUES ('${newUser.username}','${newUser.password}','default@example.com',left(uuid(), 8));`;

                con.query(query, function(err, result) {
                    if (err) throw err;
                    console.log(`${newUser.username} has been added.`);
                });
                res.send("<div align ='center'><h2>Registration successful</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>");
            } else {
                res.send("<div align ='center'><h2>User already exists</h2></div><br><br><div align='center'><a href='./registration.html'>Register again</a></div>");
            }
        } catch{
            res.send("Internal server error");
        }
    });
});

/**
 * This function will take a post request with email and password fields
 * After successful authentication, the user will move to their home page
 * Failure will result in a relogin initiated
 */
app.post('/login', async (req, res) => {
    try {
        let storedPass;
        let query = `SELECT * FROM user_information WHERE user_name = '${req.body.username}'`;
        await con.query(query, function(err, result) {
            if (result[0] == undefined) {
                res.redirect('/')
                //res.send("<div align ='center'><h2>Invalid name or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>");
            } else {
                storedPass = result[0].user_password;
                const passwordMatch = bcrypt.compareSync(req.body.password, storedPass);
                if (passwordMatch) {
                    let username = result[0].user_name;
                    res.redirect('/game');
                    //res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${username}</h3></div><br><br><div align='center'><a href='./login.html'>logout</a></div>`);
                } else {
                    res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='/'>login again</a></div>");
                }
            }
        });
    } catch{
        res.send("Internal server error");
    }
});

/**
 * This function will allow the user to load their game's state
 * The state will be returned as a json object
 */
let shared_obj = {}
app.get('/state', async(req, res) => {
    let testobj = {
        name: "name1",
        id: 100,
        gpa: 4.0
    };
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(testobj));
    shared_obj = testobj;
    //res.json(JSON.stringify(testobj));
});

/**
 * This function will allow the user to save their game's state
 * The state should be sent as a json object
 */
app.post('/state', async(req, res) => {
    res.send(shared_obj)
});

server.listen(port, function(){
    console.log(`Server is listening on port: ${port}`);
});
