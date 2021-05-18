const UserDAO = require('../data/userDAO');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class RegisterService {
    async register(username, password, email) {
        if(username === null || password === null || email === null || username.length === 0 || password.length === 0 || email.length === 0) {
            throw new Error("Invalid argument.");
        }

        let userDAO = new UserDAO();

        let hashedPass = await bcrypt.hash(password, saltRounds);

        if(await userDAO.getUser(username) === null) {
            await userDAO.add(username, hashedPass, email);
        }
        else {
            throw new Error("User already exists.");
        }
    }
}

module.exports = RegisterService;