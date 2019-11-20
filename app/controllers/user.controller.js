const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const salt = 10;

//Create the Student
exports.create = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "User can not be empty"
        });
    }

    bcrypt.hash(req.body.password, salt, function (err, hash) {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(data => {
                res.send(data)
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Error occurred while creating the user"
                });
            });
    });

}

// exports.login = (req, res) => {
//     if (req.body) {
//         if (!req.body.email) {
//             console.log("Missing email field");
//         }
//         if (!req.body.password) {
//             console.log("Missing Password Field");
//         }

//         User.find({ email: req.body.email })
//             .then((user) => {
//                bcrypt.compare(req.body.password,user[0].password, function(err,result) {
//                     if(result == true){
//                         res.send(user[0]);
//                     }else{
//                         res.status(400).send({message : "Password does not match"});
//                     }
//                });
//             });
//     } else {
//         res.status(500).send({});
//     }
// }

//Get All Students
exports.findAll = (req, res) => {
    User.find()
        .then(users => {
            res.send(users);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Error occurred while retrieving the users"
            });
        });
}

//Get the Student by id
exports.findOne = (req, res) => {
    User.findById(req.params.sId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id : " + req.params.sId
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id : " + req.params.sId
                });
            }
            return res.status(500).send({
                message: "Error retriving user with id : " + req.params.sId
            });
        });
}

//Update the student by Id
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(404).send({
            message: "User can not be empty"
        });
    }

    bcrypt.hash(req.body.password,salt, function(err, hash){
        req.body.password = hash
        User.findByIdAndUpdate(req.params.sId, {
            email: req.body.email,
            password: req.body.password
        }).then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id : " + req.params.sId
                });
            }
            res.send(user);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id : " + res.params.sId
                });
            }
            return res.status(500).send({
                message: "Error updating the user with id : " + req.params.sId
            });
        });
    })
    
}

//Delete the student by Id
exports.delete = (req, res) => {
    // User.findByIdAndDelete(req.params.sId)
    User.findByIdAndRemove(req.params.sId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with id : " + req.params.sId
                });
            }
            res.send({ message: "User Deleted Successfully." });
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with id : " + req.params.sId
                });
            }
            return res.status(500).send({
                message: "Could not delete with id : " + req.params.sId
            })
        });
}