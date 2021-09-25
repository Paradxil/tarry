const TimeEntryDAO = require('../data/timeEntryDAO');
const ProjectDAO = require('../data/projectDAO');
const TaskDAO = require('../data/taskDAO');

class GenerateReportService {
    constructor() {
        this.entryDAO = new TimeEntryDAO();
        this.taskDAO = new TaskDAO();
        this.projectDAO = new ProjectDAO();
        this.projectsFilter = [];
    }

    /**
     * 
     * @param {String} userid The userid.
     * @param {Date} start The start date for the report period.
     * @param {Date} end The end date for the report period.
     * @param {Array} projectsFilter Projects to include in the report. Empty set or null for all.
     * @param {Array} tasksFilter Tasks to include in the report. Empty set or null for all.
     */
    async generateReport(userid, start, end, projectsFilter, tasksFilter) {
        this.projectsFilter = projectsFilter;

        let startDate = new Date(start);
        startDate.setHours(0, 0, 0, 0);

        let endDate = new Date(end);
        endDate.setHours(0, 0, 0, 0);

        let numDays = (end - start)/(1000 * 3600 * 24);

        let data = {
            start: start,
            end: end,
            timeTracked: 0,
            hoursTracked: 0,
            entries: [],
            projects: {},
            tasks: {},
            days: []
        };

        //Generate report
        //Iterate over days in the report time frame, get entries
        //for that day and compile total times for projects and entries that day.
        for(let i = 0; i < numDays; i++) {
            let curDate = new Date(startDate.getTime());
            curDate.setDate(curDate.getDate() + i);

            let entries = await this.getDailyEntries(curDate.getTime(), userid);
            let dailyTotals = this.computeTotals(entries);

            data.days.push({
                date: curDate.getTime(),
                timeTracked: dailyTotals.timeTracked,
                hoursTracked: dailyTotals.hoursTracked,
                entries: entries,
                projects: dailyTotals.projects,
                tasks: dailyTotals.tasks,
                earnings: dailyTotals.earnings
            });

            //Add entries to the list of all entries
            data.entries = data.entries.concat(entries);
        }

        //Overall totals
        let totals = this.computeTotals(data.entries);

        data.timeTracked = totals.timeTracked;
        data.hoursTracked = totals.hoursTracked;
        data.tasks = totals.tasks;
        data.projects = totals.projects;
        data.earnings = totals.earnings;

        return data;
    }

    /**
     * Gets entries for the given day and populates them with project and task information.
     * @param {Number} day Date in milliseconds
     * @returns 
     */
    async getDailyEntries(day, userid) {
        let startDate = new Date(day);
        startDate.setHours(0, 0, 0, 0);

        let endDate = new Date(day);
        endDate.setHours(23, 59, 59, 999);
        
        //Set filters
        this.entryDAO.setTimeRange(startDate.getTime(), endDate.getTime());

        //Get entries
        let entries = await this.entryDAO.getAll(userid);
        let newEntries = [];

        //Compile entry and project data.
        for (let i = 0; i < entries.length; i++) {
            let entry = entries[i].toJSON();

            if(!entry.task) {
                continue;
            }

            //Filter out entries that have projects not included in the filter
            if(this.projectsFilter != null && this.projectsFilter.length > 0 && !this.projectsFilter.includes(entry.task.project._id.toString())) {
                continue;
            }

            entry.taskid = entry.task._id;

            let project = entries[i].task.project;
            if(project != null) {
                entry.projectid = project._id;
                entry.project = project.toJSON();
                newEntries.push(entry);
            }
        }

        return newEntries;
    }

    computeTotals(entries) {
        let timeTracked = 0;
        let hoursTracked = 0;
        let tasks = {};
        let projects = {};
        let earnings = 0;

        for (let entry of entries) {
            timeTracked += (entry.end - entry.start); //Overall total
            earnings += this.milliToHour(entry.end - entry.start) * entry.project.wage; //Overall earnings
            hoursTracked += this.milliToHour(entry.end - entry.start);

            if (entry.taskid != null) { //Total per task
                if (!(entry.taskid in tasks)) {
                    tasks[entry.taskid] = {
                        timeTracked: 0, 
                        hoursTracked: 0,
                        earnings: 0,
                        project: entry.task.project,
                        name: entry.task.name,
                        status: entry.status,
                        id: entry.task._id
                    };
                }

                tasks[entry.taskid].timeTracked += (entry.end - entry.start);
                tasks[entry.taskid].hoursTracked += this.milliToHour(entry.end - entry.start);
                tasks[entry.taskid].earnings += this.milliToHour(entry.end - entry.start) * entry.project.wage;
            }

            //Add a default project for entries with no project given
            projects["No Project"] = {
                timeTracked: 0,
                hoursTracked: 0,
                name: "No Project",
                color: "#aaa"
            };

            if(entry.projectid != null) { //Total per project
                if (!(entry.projectid in projects)) {
                    projects[entry.projectid] = {
                        timeTracked: 0,
                        hoursTracked: 0,
                        earnings: 0,
                        entries: [],
                        tasks: {},
                        name: entry.task.project.name,
                        color: entry.task.project.color,
                        wage: entry.task.project.wage
                    };
                }

                projects[entry.projectid].tasks[entry.task._id] = entry.task;
                projects[entry.projectid].entries.push(entry);

                projects[entry.projectid].timeTracked += (entry.end - entry.start);
                projects[entry.projectid].hoursTracked += this.milliToHour(entry.end - entry.start);
                projects[entry.projectid].earnings += this.milliToHour(entry.end - entry.start) * entry.project.wage;
            }
            else {
                projects["No Project"].timeTracked += (entry.end - entry.start);
                projects["No Project"].hoursTracked += this.milliToHour(entry.end - entry.start);
                projects["No Project"].earnings = 0; //TODO: Implement a default wage setting
            }
        }

        return {timeTracked: timeTracked, tasks: tasks, projects: projects, earnings: earnings, hoursTracked: hoursTracked};
    }

    milliToHour(milliseconds) {
        return milliseconds/1000/60/60;
    }
}

module.exports = GenerateReportService;