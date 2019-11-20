let jwt = require('jsonwebtoken');
const config = require('./env.config.js');
const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');

let checktoken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token === undefined || token == '') {
        return res.status(400).json({
            success: false,
            message: "Please provide the token"
        });
    }
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, config.JWT_secret_key, (err, decoded) => {
            if (err) {
                if (err.name == 'TokenExpiredError') {
                    return res.status(401).json({
                        success: false,
                        message: "Token is expired"
                    });
                } else {
                    return res.status(401).json({
                        success: false,
                        message: "Token is not valid"
                    });
                }

            } else {
                req.decoded = decoded;
                next();
            }
        });
    }
    // else {
    //     return res.json({
    //         success: false,
    //         message: "Auth Token is not supplied"
    //     });
    // }
};

login = (req, res) => {
    if (req.body) {
        if (!req.body.email) {
            console.log("Missing email field");
        }
        if (!req.body.password) {
            console.log("Missing Password Field");
        }

        User.find({ email: req.body.email })
            .then((user) => {
                bcrypt.compare(req.body.password, user[0].password, function (err, result) {
                    if (result == true) {
                        // res.send(user[0]);
                        const token = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        },
                            config.JWT_secret_key,
                            {
                                expiresIn: config.JWT_expires_in_seconds
                            }
                        );
                        return res.status(200).json({
                            message: "Authentication Successfull",
                            token: token
                        });
                    } else {
                        res.status(400).send({ message: "Password does not match" });
                    }
                });
            });
    } else {
        res.status(500).send({});
    }
}

module.exports = {
    checktoken: checktoken,
    login: login
}