// module.exports = (app) => {
//     const user = require('../controllers/user.controller.js');

//     //Create a new Student
//     app.post('/user',user.create);

//     //Get All Students
//     app.get('/user',user.findAll);

//     //Get student by Id
//     app.get('/user/:sId',user.findOne);

//     //Update the Student
//     app.put('/user/:sId',user.update);

//     //Delete Student by Id
//     app.delete('/user/:sId',user.delete);
// }

const middleware = require('../common/middleware.js');
module.exports = (router) => {
    const user = require('../controllers/user.controller.js');
    
    //For All Method Require Token
    // router.route('/user')
    //     .get(user.findAll)
    //     .post(user.create);
    
    // router.route('/user/:sId')
    //     .get(user.findOne)
    //     .put(user.update)
    //     .delete(user.delete);

    //Only This Method do not require token, rest of this all method requires token
    router.post('/user', user.create);

    router.get('/user', [
        middleware.checktoken,
        user.findAll
    ]);

    router.get('/user/:sId', [
        middleware.checktoken,
        user.findOne
    ]);

    router.delete('/user/:sId', [
        middleware.checktoken,
        user.delete
    ]);

    router.put('/user/:sId', [
        middleware.checktoken,
        user.update
    ]);
}
