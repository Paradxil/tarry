const ActiveTaskDAO = require('../data/activeTaskDAO');

class StartTaskService {
    async startTask(userid, taskid, start) {

        if(taskid === null) {
            throw new Error("Error creating task.");
        }

        let dao = new ActiveTaskDAO();
        await dao.add(userid, taskid, start);
    }
}

module.exports = StartTaskService;