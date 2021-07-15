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

        //Set filters
        entryDAO.setTimeRange(start, end);

        //Get entries
        let entries = await entryDAO.getAll(userid);

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
            tasks: {}
        };

        let totals = this.computeTotals(entries);

        data.timeTracked = totals.timeTracked;
        data.tasks = totals.tasks;
        data.projects = totals.projects;

        console.log(data);

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

            if (entry.projectid != null) { //Total per project
                if (!(entry.projectid in projects)) {
                    projects[entry.projectid] = {
                        timeTracked: 0,
                        name: entry.project.name,
                        color: entry.project.color
                    };
                }

                projects[entry.projectid].timeTracked += (entry.end - entry.start);
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