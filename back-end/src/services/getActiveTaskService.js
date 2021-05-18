const ActiveTaskDAO = require('../data/activeTaskDAO');

class GetActiveTaskService {
    async getTask(userid) {
        let dao = new ActiveTaskDAO();
        return await dao.get(userid);
    }
}

module.exports = GetActiveTaskService;