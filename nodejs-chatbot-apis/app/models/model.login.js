class LoginModel {
    constructor(data) {
        this.email = data.email;
        this.password = data.password;
        this.expiresAt = data.expiresAt;
    }
}

module.exports = LoginModel;
