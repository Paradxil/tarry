const TimeEntryDAO = require('../data/timeEntryDAO');
const ProjectDAO = require('../data/projectDAO');
const TaskDAO = require('../data/taskDAO');

class GenerateReportService {
    /**
     * 
     * @param {String} userid The userid.
     * @param {Date} start The start date for the report period.
     * @param {Date} end The end date for the report period.
     * @param {Array} projectsFilter Projects to include in the report. Empty set or null for all.
     * @param {Array} tasksFilter Tasks to include in the report. Empty set or null for all.
     */
    async generateReport(userid, start, end, projectsFilter, tasksFilter) {
        let entryDAO = new TimeEntryDAO();
        let taskDAO = new TaskDAO();
        let projectDAO = new ProjectDAO();

        let startDate = new Date(start);
        startDate.setHours(0, 0, 0, 0);

        let endDate = new Date(end);
        endDate.setHours(0, 0, 0, 0);

        let numDays = (end - start)/(1000 * 3600 * 24);

        //Set filters
        entryDAO.setTimeRange(start, end);

        //Get entries
        let entries = await entryDAO.getAll(userid);

        //Compile entry, project, and task data.
        for(let i = 0; i < entries.length; i++) {
            let entry = entries[i].toJSON();

            let task = await taskDAO.getTask(entry.taskid);
            entry.task = task.toJSON();
            entry.name = task.name;
            entry.projectid = task.project;
            entry.status = task.status;

            let project = await projectDAO.get(task.project);
            entry.project = project.toJSON();
            entries[i] = entry;
            //console.log(entry);
        }

        let data = {
            start: start,
            end: end,
            timeTracked: 0,
            entries: entries,
            projects: {},
            tasks: {},
            days: {}
        };

        //Initialize days
        for(let i = 0; i < numDays; i++) {
            let tmpDate = new Date(startDate.getTime());
            tmpDate.setDate(tmpDate.getDate() + i);

            let id = tmpDate.getTime();
            data.days[id] = {
                    date: id,
                    timeTracked: 0,
                    entries: [],
                    projects: {},
                    tasks: {}
            }
        }

        // Get entries by day
        for (let i = 0; i < entries.length; i++) {
            let entry = entries[i];
            let curDate = new Date(entry.start);
            curDate.setHours(0, 0, 0, 0);
            let id = curDate.getTime();

            data.days[id].timeTracked += (entry.end - entry.start);
            data.days[id].entries.push(entry);
        }

        //Calculate daily totals
        for(let day in data.days) {
            let dailyTotals = this.computeTotals(data.days[day].entries);
            data.days[day].tasks = dailyTotals.tasks;
            data.days[day].projects = dailyTotals.projects;
            data.days[day].timeTracked = dailyTotals.timeTracked;
        }

        let totals = this.computeTotals(entries);

        data.timeTracked = totals.timeTracked;
        data.tasks = totals.tasks;
        data.projects = totals.projects;

        return data;
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

/*
let data = {
    start: 0, //Start date
    end: 1, //End date
    timeTracked: 15, //Total time tracked
    projects: [ //List of projects tracked during period
        {
            id: 0, //Project id
            timeTracked: 7 //Total time tracked for this project
            //...
        }
    ],
    tasks : [ //List of tasks tracked during period
        {
            id: 0, //Task id
            timeTracked: 7 //Total time tracked for this task
            //...
        }
    ],
    days: { //Days in the time period
        0: {
            timeTracked: 7, //Total time tracked on this day
            projects: [ //List of projects tracked on this day
                {
                    id: 0, //Project id
                    timeTracked: 7 //Total time tracked for this project
                }
            ], 
            tasks: [ //List of tasks tracked on this day
                {
                    id: 0, //Task id
                    timeTracked: 7 //Total time tracked for this task
                }
            ]
        },
        1: {//etc.} 
    }
}*/