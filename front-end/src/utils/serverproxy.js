import network from "./network.js";

class ServerProxy {
    async getActiveTask(cb) {
        let response = await network.get("/api/task/active/");
        let task = null;

        if(response.success && cb) {
            task = response.data;
            cb(task);
        }
    }

    async getProjects(cb) {
        let response = await network.get("/api/project/all/");
        let projectsMap = {};
        let projects = [];

        if(response.success && cb) {
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

        if(response.success && cb) {
            report = response.data;
            cb(report);
        }
    }

    async stopActiveTask(endTime, cb) {
        let response = await network.post("/api/stop", {
            end: endTime
        });

        if(response.success && cb) {
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

        if(response.success && cb) {
            cb();
        }
    }

    async deleteEntry(id, cb) {
        let response = await network.delete("/api/time/"+id);
        if(response.success && cb) {
            cb();
        }
    }

    async deleteProject(id, cb) {
        let response = await network.delete('/api/project/' + id);
        if(response.success && cb) {
            cb();
        }
    }

    async saveProject(project, cb) {
        let response = await network.post('/api/project', project);
        if(response.success && cb) {
            cb(response.data.project);
        }
    }

    async getProject(id, cb) {
        let response = await network.get('/api/project/'+id);
        if(response.success && cb) {
            cb(response.data);
        }
    }

    async getInvoices(cb) {
        let response = await network.get("/api/invoice/all/");
        if(response.success && cb) {
            cb(response.data);
        }
    }

    async getAddresses(cb) {
        let response = await network.get("/api/address/all/");
        if(response.success && cb) {
            let addresses = response.data;
            let addressesMap = {};

            for(let address of addresses) {
                addressesMap[address._id] = address;
            }

            cb(addresses, addressesMap);
        }
    }
}

export default new ServerProxy();