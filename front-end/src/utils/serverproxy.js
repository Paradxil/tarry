import network from "./network.js";

class ServerProxy {
    async loadActiveTask(cb) {
        let response = await network.get("/api/task/active/");
        let task = null;

        if(response.success) {
            task = response.data;
            cb(task);
        }
    }

    async loadProjects(cb) {
        let response = await network.get("/api/project/all/");
        let projectsMap = {};
        let projects = [];

        if(response.success) {
            projects = response.data;

            for(let project of projects) {
                projectsMap[project._id] = project;
            }
            cb(projects, projectsMap);
        }
    }

    async generateReport(start, end, projectFilter, taskFilter, cb) {
        let response = await network.post("/api/report", {
            start: start, //Start date
            end: end, //End date
            projects: projectFilter, //A list of projectIDs to include in the report. Empty to include all projects.
            tasks: taskFilter //A list of taskIDs to include in the report. Empty to include all tasks.
        });

        let report = {};

        if(response.success) {
            report = response.data;
            cb(report);
        }
    }
}

export default new ServerProxy();