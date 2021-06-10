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

    async getPaginated(userid, max=10, last=null) {
        let query = {
            _id: {$gt: last},
            userid: userid
        };

        if(last === null) {
            delete query._id;
        }

        return await TimeEntry.find(query).sort({_id: -1}).limit(max);
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