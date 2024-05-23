const db = require("../sequelize_models");
const LoginModel = require("../models/model.login");
const Login = db.logins;
const Op = db.Sequelize.Op;

const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Generate a secure password
const generateSecurePassword = (length = 12) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
};

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // or another email service
    auth: {
        user: 'kolakhareminu@gmail.com',
        pass: '9545126904'
    }
});

// Create and Save a new Login
exports.create = async (req, res) => {
    
    if (!req.body.email) {
        return res.status(400).send({ message: "email can not be empty!", statusCode: 400 });        
    }

    const email = req.body.email;
    const password = generateSecurePassword();
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

    const mailOptions = {
        from: 'kolakhareminu@gmail.com',
        to: email,
        subject: 'Your Secure Password',
        text: `Your secure password is: ${ password }. It will expire in 2 hours.`
    };

    const existingEmailEntry = await Login.findOne({ where: { email: email } });

    if (existingEmailEntry && existingEmailEntry?.dataValues) {
        
        const timestamp1 = new Date(existingEmailEntry.dataValues?.expiresAt).getTime();
        const timestamp2 = new Date().getTime();

        if (timestamp1 < timestamp2) {
            // Update the password and expiry time in the database
            await Login.update({ password: password, expiresAt: expiresAt },
                { where: { email: email }, returning: true, plain: true });

            return res.status(200).send({ message: 'Password updated successfully', statusCode: 200 });

            // transporter.sendMail(mailOptions, (error, info) => {
            //     if (error) {
            //         return res.status(500).json({ message: 'Error sending email', error, statusCode: 500});
            //     }
            //     res.status(200).json({ message: 'Password generated and sent successfully', statusCode: 200 });
            // });

        } else if (existingEmailEntry.dataValues?.password) {
            return res.status(200).json({ message: 'A valid password already exists for this email', statusCode: 400 });
        }
        return res.status(400).json({ message: 'kkk exists for this email', statusCode: 400 });
    } else {
        
        const login = new LoginModel({ email, password, expiresAt });
        
        Login.create(login).then(data => {
                // transporter.sendMail(mailOptions, (error, info) => {
                //     if (error) {
                //         return res.status(500).json({ message: 'Error sending email', error });
                //     }
                //     res.status(200).json({ message: 'Password generated and sent successfully' });
                // });
            res.status(200).send({ message: "Password generated and sent successfully!", statusCode: 200 });
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Some error occurred while creating the Login.", statusCode: 500 });
            });
    }
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    // const email = req.body.email;
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    Login.findAll({ where: condition }).then(data => {
        res.status(200).send({ data, statusCode: 200 });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving categories.", statusCode: 500
        });
    });
};

// Find a single Login with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Login.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Login with id=" + id
            });
        });
};

// Update a Login by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Login.update(req.body, {
        where: { id: id }
    }).then(num => {
        if (num == 1) {
            res.send({
                message: "Login was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Login with id=${id}. Maybe Login was not found or req.body is empty!`
            });
        }
    })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Login with id=" + id
            });
        });
};

// Delete a Login with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Login.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Login was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Login with id=${id}. Maybe Login was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Login with id=" + id
            });
        });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Login.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Tutorials were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all categories."
            });
        });
};

exports.checkLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(200).json({ message: 'Email and password are required', statusCode: 400 });
    }

    const existingEmailEntry = await Login.findOne({ where: { email: email } })

    if (existingEmailEntry && existingEmailEntry?.dataValues) {

        if (new Date(existingEmailEntry.dataValues?.expiresAt) < new Date()) {
            return res.status(200).json({ message: 'Password has expired', statusCode: 400 });
        }
        if (existingEmailEntry.dataValues?.password !== password) {
            return res.status(200).json({ message: 'Invalid email or password', statusCode: 400 });
        }
        return res.status(200).json({ message: 'Login successful', statusCode :200});
    } else {
        return res.status(200).json({ message: 'Email not exist', statusCode: 400 });
    }
};
