const ActiveTaskDAO = require('../data/activeTaskDAO');

class StartTaskService {
    async startTask(userid, name, start) {
        let dao = new ActiveTaskDAO();
        let success = await dao.add(userid, name, start);

        if(!success) {
            throw new Error("Error starting task.");
        }
    }
}

module.exports = StartTaskService;