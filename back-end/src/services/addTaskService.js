const TaskDAO = require('../data/taskDAO');

class AddTaskService {
    async addTask(name, userid, project) {
        let taskDAO = new TaskDAO();
        return await taskDAO.add(name, userid, project);
    }
}

module.exports = AddTaskService;