const TimeEntryDAO = require('../data/timeEntryDAO');
const ProjectDAO = require('../data/projectDAO');
const TaskDAO = require('../data/taskDAO');

class GenerateReportService {
    constructor() {
        this.entryDAO = new TimeEntryDAO();
        this.taskDAO = new TaskDAO();
        this.projectDAO = new ProjectDAO();
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
        let startDate = new Date(start);
        startDate.setHours(0, 0, 0, 0);

        let endDate = new Date(end);
        endDate.setHours(0, 0, 0, 0);

        let numDays = (end - start)/(1000 * 3600 * 24);

        let data = {
            start: start,
            end: end,
            timeTracked: 0,
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
                entries: entries,
                projects: dailyTotals.projects,
                tasks: dailyTotals.tasks
            });

            //Add entries to the list of all entries
            data.entries = data.entries.concat(entries);
        }

        //Overall totals
        let totals = this.computeTotals(data.entries);

        data.timeTracked = totals.timeTracked;
        data.tasks = totals.tasks;
        data.projects = totals.projects;

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

        //Compile entry, project, and task data.
        for (let i = 0; i < entries.length; i++) {
            let entry = entries[i].toJSON();

            let task = await this.taskDAO.getTask(entry.taskid);
            entry.task = task.toJSON();
            entry.name = task.name;
            entry.projectid = task.project;
            entry.status = task.status;

            let project = await this.projectDAO.get(task.project);
            if(project != null) {
                entry.project = project.toJSON();
                entries[i] = entry;
            }
        }

        return entries;
    }

    computeTotals(entries) {
        let timeTracked = 0;
        let tasks = {};
        let projects = {};

        for (let entry of entries) {
            timeTracked += (entry.end - entry.start); //Overall total

            if (entry.taskid != null) { //Total per task
                if (!(entry.taskid in tasks)) {
                    tasks[entry.taskid] = {
                        timeTracked: 0, 
                        name: entry.name,
                        status: entry.status,
                        id: entry.taskid
                    };
                }

                tasks[entry.taskid].timeTracked += (entry.end - entry.start);
            }

            //Add a default project for entries with no project given
            projects["No Project"] = {
                timeTracked: 0,
                name: "No Project",
                color: "#aaa"
            };

            if(entry.projectid != null) { //Total per project
                if (!(entry.projectid in projects)) {
                    projects[entry.projectid] = {
                        timeTracked: 0,
                        name: entry.project.name,
                        color: entry.project.color
                    };
                }

                projects[entry.projectid].timeTracked += (entry.end - entry.start);
            }
            else {
                projects["No Project"].timeTracked += (entry.end - entry.start);
            }
        }

        return {timeTracked: timeTracked, tasks: tasks, projects: projects};
    }
}

module.exports = GenerateReportService;