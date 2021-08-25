import network from "./network.js";

class ServerProxy {
    async getActiveTask(cb) {
        let response = await network.get("/api/task/active/");
        let task = null;

        if(response.success) {
            task = response.data;
            cb(task);
        }
    }

    async getProjects(cb) {
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

    async stopActiveTask(endTime, cb) {
        let response = await network.post("/api/stop", {
            end: endTime
        });

        if(response.success) {
            let newEntry = response.data;
            cb(newEntry);
        }
    }

    async startTask(name, startTime, project, cb) {
        let response = await network.post("/api/start", {
            name: name,
            start: startTime,
            project: project
        });

        if(response.success) {
            cb();
        }
    }

    async deleteEntry(id, cb) {
        let response = await network.delete("/api/time/"+id);
        if(response.success) {
            cb();
        }
    }
}

export default new ServerProxy();