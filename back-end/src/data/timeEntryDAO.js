const TimeEntry = require('../model/timeEntry');

class TimeEntryDAO {
    async get(id) {
        return await TimeEntry.findOne({_id: id});
    }

    async remove(id) {
        return await TimeEntry.deleteOne({_id: id});
    }

    async getAll(userid) {
        return await TimeEntry.find({userid: userid});
    }

    async getAllFromTask(taskid) {
        return await TimeEntry.find({taskid: taskid});
    }

    async add(userid, taskid, start, end) {
        let entry = new TimeEntry({
            userid: userid,
            taskid: taskid,
            start: start,
            end: end
        });
        await entry.save();
        return entry;
    }

    async update(id, userid, taskid, start, end,) {
        let entry = await this.get(id);
        entry.userid = userid;
        entry.taskid = taskid;
        entry.start = start;
        entry.end = end;
    }
}

module.exports = TimeEntryDAO;