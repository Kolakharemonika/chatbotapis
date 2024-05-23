module.exports = (sequelize, Sequelize) => {
    const Chatbot = sequelize.define("chatbot", {
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        }
    });

    return Chatbot;
};