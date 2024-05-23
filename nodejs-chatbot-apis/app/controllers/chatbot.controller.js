const db = require("../sequelize_models");
const ChatbotModel = require("../models/model.chatbot");
const Chatbot = db.chatbots;
const Op = db.Sequelize.Op;

// Create and Save a new Chatbot
exports.create = async (req, res) => {
    console.log(req, 'req')
    // Validate request
    if (!req.body.title || !req.body.description) {
        return res.status(400).send({ message: "field can not be empty!", statusCode: 400 });
    }

    const title = req.body.title;
    const description = req.body.description;

    // Create a Chatbot
    const chatbot = new ChatbotModel({ title, description });
    console.log(chatbot, 'chatbot');

    // Save Chatbot in the database
    Chatbot.create(chatbot).then(data => {
            res.status(200).send({ message: "chatbot added successfully!", statusCode: 200 });
        }).catch(err => {
            res.status(500).send({ message: err.message || "Some error occurred while creating the chatbot.", statusCode: 500 });
        });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    Chatbot.findAll({ where: condition }).then(data => {
        res.status(200).send({ chatbotsData: data, statusCode: 200 });
    }).catch(err => {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving categories.", statusCode: 500 });
    });
};
