let TaskDAO = require('../data/taskDAO');
let EntryDAO = require('../data/timeEntryDAO');

class UpdateTimeEntryService {
    async updateEntry(userid, id, name, project, start, end) {
        if(start === null || end === null || id === null || userid === null) {
            throw new Error("Cannot update entry with null args.");
        }

        let entryDAO = new EntryDAO();
        let taskDAO = new TaskDAO();

        let entry = await entryDAO.get(id);
        let task = await taskDAO.getTask(entry.taskid);

        if(name === null) {
            name = task.name;
        }

        if(entry.userid.toString() !== userid.toString()) {
            throw new Error("You cannot update an entry for a different user.");
        }

        let taskid = entry.taskid;

        let newTask = await taskDAO.add(name, userid, project);
        taskid = newTask._id;

        let updatedEntry = await entryDAO.update(id, userid, taskid, start, end);
        return updatedEntry;
    }
}

module.exports = UpdateTimeEntryService;