const ActiveTaskDAO = require('../data/activeTaskDAO');
const TaskDAO = require('../data/taskDAO');
const ProjectDAO = require('../data/projectDAO');

class GetActiveTaskService {
    async getTask(userid) {
        let dao = new ActiveTaskDAO();
        let taskDAO = new TaskDAO();

        let activeTask = await dao.get(userid);

        if(activeTask !== null && activeTask.taskid !== null) {
            let task = await taskDAO.getTask(activeTask.taskid);

            if(task !== null) {
                activeTask = activeTask.toJSON();
                activeTask.name = task.name;
                activeTask.status = task.status;
            }

            if(task.project !== null) {
                let project = await ProjectDAO.get(task.project);

                if(project !== null) {
                    activeTask.project = project;
                }
            }
        }

        return activeTask;
    }
}

module.exports = GetActiveTaskService;