const ActiveTaskDAO = require('../data/activeTaskDAO');
const TimeEntryDAO = require('../data/timeEntryDAO');
const TaskDAO = require('../data/taskDAO');

class StopTaskService {
    async stopTask(userid, end) {
        let activeDAO = new ActiveTaskDAO();
        let timeEntryDAO = new TimeEntryDAO();
        let taskDAO = new TaskDAO();

        let activetask = await activeDAO.get(userid);
        await activeDAO.remove(userid);

        let entry = await timeEntryDAO.add(userid, activetask.taskid, activetask.start, end);
        let task = await taskDAO.getTask(entry.taskid); 

        entry = entry.toJSON();
        entry.name = task.name;
        entry.project = task.project;
        entry.status = task.status;
        
        return entry;
    }
}

module.exports = StopTaskService;