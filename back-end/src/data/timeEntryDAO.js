const TimeEntry = require('../model/timeEntry');

class TimeEntryDAO {
    constructor() {
        this.startTime = null;
        this.endTime = null;
        this.projectsFilter = [];
        this.tasksFilter = [];
    }

    /**
     * Set a time range to filter results on. 
     * After setting a time range all entries returned from 'get' and 'getAll' queries will be inside this range.
     * @param {*} start 
     * @param {*} end 
     */
    setTimeRange(start, end) {
        this.startTime = start;
        this.endTime = end;
    }

    /**
     * A list of projects to include.
     * After setting this filter all entries returned from 'get' and 'getAll' queries will belong to one of these projects.
     * @param {Array} projects Empty set or null for no filter.
     */
    setProjectsFilter(projects) {
        this.projectsFilter = projects;
    }

    /**
     * A list of tasks to include in results.
     * After setting this filter all entries returned from 'get' and 'getAll' queries will belong to one of these tasks.
     * @param {*} tasks 
     */
    setTasksFilter(tasks) {
        this.tasksFilter = tasks;
    }

    /**
     * Builds a complete query from the DAO's filters and the provided query.
     * @param {Object} query
     * @returns A complete query with any filters.
     */
    buildQuery(query) {
        let queries = [query];

        //Add range filter
        if(this.startTime != null && this.endTime != null) {
            queries.push({ start: { $gte: this.startTime } });
            queries.push({ start: { $lte: this.endTime } });
        }

        //TODO: Add other filters

        console.log(queries);

        return {$and: queries};
    }

    async get(id) {
        return await TimeEntry.findOne(this.buildQuery({_id: id}));
    }

    async remove(id) {
        return await TimeEntry.deleteOne({_id: id});
    }

    async getAll(userid) {
        return await TimeEntry.find(this.buildQuery({userid: userid}));
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
        await entry.save();
        return entry;
    }
}

module.exports = TimeEntryDAO;