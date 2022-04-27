const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");

let token_list = [];
let token_path = path.join(__dirname, '../../assets/tokens');

fs.readdir(path.join(token_path), (err, files) => {
    if (err) console.log(err)
    token_list = files
})

router.get('/', async(req, res) => {
    res.json(token_list);
});

router.get('/:id', async(req, res) => {
    res.sendFile(path.join(token_path, `${req.params.id}`));
});


const upload = multer({
    storage: multer.diskStorage(
        {
            destination: function (req, file, cb) {
                cb(null, token_path);
            },
            filename: function (req, file, cb) {
                cb(                    
                    null,
                    new Date().valueOf() + 
                    '_' +
                    file.originalname
                );
            }
        }
    ), 
});

router.post("/upload" ,upload.single("file"), async(req, res) => {    
    console.log(req.file);
    res.json('/upload api');
});

module.exports = router;