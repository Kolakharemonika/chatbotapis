
module.exports = app => {
    const chatbots = require("../controllers/chatbot.controller.js");

    var router = require("express").Router();

    // Create a new chatbots
    router.post("/chatbots", chatbots.create);

    // Retrieve all chatbots
    router.get('/chatbots', chatbots.findAll);

    app.use('/api/v1', router);

}