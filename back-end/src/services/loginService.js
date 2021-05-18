const UserDAO = require('../data/userDAO');
const bcrypt = require('bcrypt');

class LoginService {
    async login(username, password) {
        let userDAO = new UserDAO();

        try {
            let user = await userDAO.getUser(username);

            if(user !== null) {
                const match = await bcrypt.compare(password, user.password);
                if(match) {
                    return user;
                }
            }
        }
        catch(err) {
            console.log(err);
            throw err;
        }

        return null;
    }
}

module.exports = LoginService;