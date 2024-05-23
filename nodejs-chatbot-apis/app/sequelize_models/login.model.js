module.exports = (sequelize, Sequelize) => {
    const Login = sequelize.define("login", {
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,  
                len: [10, 50],
            }

        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        expiresAt: {
            type: Sequelize.DATE,
            allowNull: false,
        },
    });

    return Login;
};