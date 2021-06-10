const ActiveTaskDAO = require('../data/activeTaskDAO');

class StartTaskService {
    async startTask(userid, taskid, start, projects) {
        let dao = new ActiveTaskDAO();
        let success = await dao.add(userid, taskid, start, projects);

        if(!success) {
            throw new Error("Error starting task.");
        }
    }
}

module.exports = StartTaskService;