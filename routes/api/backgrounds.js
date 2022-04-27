const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");

let background_list = [];
let background_path = path.join(__dirname, '../../assets/backgrounds');

fs.readdir(path.join(background_path), (err, files) => {
    if (err) console.log(err)
    background_list = files
})

router.get('/', async(req, res) => {
    res.json(background_list);
});

router.get('/:id', async(req, res) => {
    res.sendFile(path.join(background_path, `${req.params.id}`));
});


const upload = multer({
    storage: multer.diskStorage(
        {
            destination: function (req, file, cb) {
                cb(null, background_path);
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