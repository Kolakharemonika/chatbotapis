var express = require('express');
const bodyParser = require("body-parser"); /* deprecated */
const cors = require('cors');
var cookieParser = require('cookie-parser');

var app = express();
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

const db = require("./app/sequelize_models");

// db.sequelize.sync();

// db.sequelize.sync().then(function () {
//    console.log('DB connection sucessful.');
// }).catch(err => console.log('DB connection error has occured',err));

db.sequelize.authenticate().then(() => {
    console.log(`Connection has been established successfully. ${corsOptions.origin}`);
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

// drop the table if it already exists { alter: true }
// db.sequelize.sync({ alter: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

//simple route
app.get('/', (req, res) => {
    res.send("Welcome to express-js example");
});

require("./app/routes/login.routes")(app);
require("./app/routes/chatbot.routes")(app);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, HEAD, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Accept, Content-Type, Authorization, X-Requested-With");
    next();
})
module.exports = app;