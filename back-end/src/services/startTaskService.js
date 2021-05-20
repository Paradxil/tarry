const ActiveTaskDAO = require('../data/activeTaskDAO');

class StartTaskService {
    async startTask(userid, name, start, projects) {
        let dao = new ActiveTaskDAO();
        let success = await dao.add(userid, name, start, projects);

        if(!success) {
            throw new Error("Error starting task.");
        }
    }
}

module.exports = StartTaskService;