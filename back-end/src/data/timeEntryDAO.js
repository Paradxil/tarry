const TimeEntry = require('../model/timeEntry');
var mongoose = require('mongoose');

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
        if (this.startTime != null && this.endTime != null) {
            queries.push({ start: { $gte: this.startTime } });
            queries.push({ start: { $lte: this.endTime } });
        }

        //TODO: Add other filters

        return { $and: queries };
    }

    async get(id) {
        return await TimeEntry.findOne(this.buildQuery({ _id: id }));
    }

    async remove(id) {
        return await TimeEntry.deleteOne({ _id: id });
    }

    async getAll(userid) {
        return await TimeEntry.find(this.buildQuery({ userid: userid }));
    }

    async getAllFromTask(taskid) {
        return await TimeEntry.find({ task: taskid });
    }

    /**
     * Get at most max days worth of timeEntries before last for a given user.
     * For example setting max to 5 will return the timeEntries for the last
     * 5 days with timeEntries, skipping any days without.
     * 
     * @param {string} userid 
     * @param {number} max Number of days to find time entries for
     * @param {Date} last Start time of last TimeEntry
     * @returns {import('../model/timeEntry').TimeEntry[]}
     */
    async getPaginated(userid, max = 5, last = null, timezone = 'America/Boise') {
        let query = [
            {
                $match: {
                    userid: userid.toString(),
                    start: { $lt: last }
                }
            },
            {
                $lookup: {
                    from: 'tasks',
                    localField: 'task',
                    foreignField: '_id',
                    as: 'task'
                }
            },
            {
                $unwind: {
                    path: '$task'
                }
            },
            {
                $lookup: {
                    from: 'projects',
                    localField: 'task.project',
                    foreignField: '_id',
                    as: 'project'
                }
            },
            {
                $unwind: {
                    path: '$project'
                }
            },
            {
                $project: {
                    year: { $year: {date: "$start", timezone: timezone} },
                    month: { $month: {date: "$start", timezone: timezone}  },
                    day: { $dayOfMonth: {date: "$start", timezone: timezone}  },
                    task: 1,
                    project: 1,
                    start: 1,
                    end: 1,
                    duration: { $subtract: ['$end', '$start'] }
                }
            },
            {
                $group: {
                    _id: {
                        year: '$year',
                        month: '$month',
                        day: '$day'
                    },
                    entries: { $push: "$$ROOT" },
                    count: { $sum: 1 },
                    hoursTracked: { $sum: {$divide: ['$duration',  1000 * 60 * 60]} } // Convert milliseconds to hours.
                }
            },
            {
                $sort: {
                    '_id.year': -1,
                    '_id.month': -1,
                    '_id.day': -1
                }
            },
            {
                $limit: max
            }
        ];

        if (last === null) {
            delete query[0]['$match'].start;
        }

        let result = await TimeEntry.aggregate(query);

        return result;
    }

    async add(userid, taskid, start, end) {
        let entry = new TimeEntry({
            userid: userid,
            task: mongoose.Types.ObjectId(taskid),
            start: start,
            end: end
        });
        await entry.save();
        return entry;
    }

    async update(id, userid, taskid, start, end,) {
        let entry = await this.get(id);
        entry.userid = userid;
        entry.task = mongoose.Types.ObjectId(taskid);
        entry.start = start;
        entry.end = end;
        await entry.save();
        return entry;
    }
}

module.exports = TimeEntryDAO;