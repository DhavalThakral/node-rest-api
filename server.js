const express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();
const config = require('./app/common/env.config.js');
const middleware = require('./app/common/middleware.js');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json());

// const dbconfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(config.Database_config, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to database");
}).catch(err => {
    console.log("Could not connect to database",err);
    process.exit();
});

router.get('/',(req,res) => {
    res.json({message : "Welcome in router..."});
});

// app.get('/',(req,res) => {
//     res.json({"message" : "Hello Welcome.."});
// });
// app.use('/',router);
app.post('/login',middleware.login);
// app.use('/',middleware.checktoken,router);
app.use('/',router);

require('./app/routes/user.routes.js')(router);

app.listen(config.Port, () => {
    console.log("Server is listening on port 3001")
});