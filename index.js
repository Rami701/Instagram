const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fileUpload = require('express-fileupload');
const db = require('./models');
// const sessions = require('express-session');
// const store = new sessions.MemoryStore();
const port = 3000;

// const oneDay = 1000 * 60 * 60 * 24;


// app.use(sessions({
//     secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
//     saveUninitialized:false,
//     cookie: { maxAge: oneDay },
//     resave: false ,
//     store: store,
// }));


const { fileLoader } = require('ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// load assets
app.use('/css', express.static(path.resolve(__dirname, 'assets/css')));
app.use('/img', express.static(path.resolve(__dirname, 'assets/img')));
app.use('/js', express.static(path.resolve(__dirname, 'assets/js')));
app.use('/upload', express.static(path.resolve(__dirname, 'assets/upload')));

app.get('/', (req, res) => {
    res.send('Hello World!');
});


db.sequelize.sync().then((req) => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});

