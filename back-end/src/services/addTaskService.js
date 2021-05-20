const TaskDAO = require('../data/taskDAO');

class AddTaskService {
    async addTask(name, userid, start, end, projects) {
        let taskDAO = new TaskDAO();
        return await taskDAO.add(name, userid, start, end, projects);
    }
}

module.exports = AddTaskService;