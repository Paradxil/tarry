const TimeEntryDAO = require('../data/timeEntryDAO');
const TaskDAO = require('../data/taskDAO');

class PaginatedTimeEntriesService {
    async getEntries(userid, max, last) {
        let entryDAO = new TimeEntryDAO();
        let taskDAO = new TaskDAO();

        //Get the time entries
        let entries = await entryDAO.getPaginated(userid, max, last);
        let tasks = {};

        let data = []; //Stores the final entry data with task data.

        //Add the task data to each entry
        for(let entry of entries) {
            let task = null;
            if(entry.taskid in tasks) {
                task = tasks[entry.taskid];
            }
            else {
                task = await taskDAO.getTask(entry.taskid);

                if(task === null) {
                    console.log('ERROR locating task');
                    continue;
                }
                else {
                    tasks[entry.taskid] = task;
                }
            }

            entry = entry.toJSON();
            entry.name = task.name;
            entry.project = task.project||(task.projects?task.projects[0]:null);
            entry.status = task.status;
            data.push(entry);
        }

        return data;
    }
}

module.exports = PaginatedTimeEntriesService;