const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");

const port = process.env.PORT || 9000
const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'./public/README.html'));
});

app.use('/auth', require('./routes/api/auth.js'))

app.use('/backgrounds', require('./routes/api/backgrounds.js'))

app.use('/state', require('./routes/api/state.js'))

app.use('/tokens', require('./routes/api/tokens.js'))

app.listen(port, () => console.log(`Server is listening on port: ${port}`))
