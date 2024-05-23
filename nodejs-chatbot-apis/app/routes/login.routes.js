
module.exports = app => {
    const logins = require("../controllers/login.controller.js");

    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/generate-password", logins.create);

    // Retrieve all Tutorials
    router.get("/", logins.findAll);

    // POST endpoint to verify the entered password
    router.post('/login', logins.checkLogin);

    // router.post('/login', logins.checkEmail);

    app.use('/api/v1', router);

}