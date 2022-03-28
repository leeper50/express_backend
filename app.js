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


const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));


app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'));
});


app.post('/register', async (req, res) => {
    // TODO: check if email or name is in use already
    try {
        //if (!foundUser) {    
            let hashPassword = await bcrypt.hash(req.body.password, 10);
            let newUser = {
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
            };

            let query = "INSERT INTO user_information (user_name,user_password,user_email,user_code) " +
            `VALUES ('${newUser.username}','${newUser.password}','${newUser.email}',left(uuid(), 8));`;

            con.query(query, function(err,result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
    
            res.send("<div align ='center'><h2>Registration successful</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>");
        //} else {
        //    res.send("<div align ='center'><h2>Email already used</h2></div><br><br><div align='center'><a href='./registration.html'>Register again</a></div>");
        //}
    } catch{
        res.send("Internal server error");
    }
});

app.post('/login', async (req, res) => {
    // TODO: fix incorrect user name crashing the server
    try {
        let storedPass;
        let query = `SELECT * FROM user_information WHERE user_email = '${req.body.email}'`;
        con.query(query, function(err, result) {
            console.log("1");
            if (err) throw err;
            console.log("2");
            storedPass = setPass(result[0].user_password);
            console.log("3");
            const passwordMatch = bcrypt.compareSync(req.body.password, storedPass);
            console.log("4");
            if (passwordMatch) {
                let usrname = result[0].user_name;
                res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${usrname}</h3></div><br><br><div align='center'><a href='./login.html'>logout</a></div>`);
            } else {
                res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>");
            }
        });
        /*
        if (foundUser) {
    
            let submittedPass = req.body.password; 
            let storedPass = foundUser.password; 
    
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
            if (passwordMatch) {
                let usrname = foundUser.username;
                res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${usrname}</h3></div><br><br><div align='center'><a href='./login.html'>logout</a></div>`);
            } else {
                res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>");
            }
        }
        else {
    
            let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
            await bcrypt.compare(req.body.password, fakePass);
    
            res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align='center'><a href='./login.html'>login again<a><div>");
        }*/
    } catch{
        res.send("Internal server error");
    }
});

function setPass(result) {
    return result;
}

server.listen(3000, function(){
    console.log("server is listening on port: 3000");
});