const User = require('../model/user');

class UserDAO {
    async getUser(username) {
        return await User.findOne({username: username.toLowerCase()});
    }
    
    async getUserById(id) {
        return await User.findOne({_id: id});
    }

    async add(username, password, email) {
        let user = new User({
            username: username.toLowerCase(),
            email: email,
            password: password
        });
        await user.save();
    }
}

module.exports = UserDAO;