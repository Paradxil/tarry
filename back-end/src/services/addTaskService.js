const TaskDAO = require('../data/taskDAO');

class AddTaskService {
    async addTask(name, userid, start, end) {
        let taskDAO = new TaskDAO();
        return await taskDAO.add(name, userid, start, end);
    }
}

module.exports = AddTaskService;