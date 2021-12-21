import network from "./network.js";

class ServerProxy {
    async getUser(cb, err) {
        let response = await network.get("/api/user");

        if(response.success && cb) {
            cb(response.data);
        }
        else {
            if(err) {
                err(response.data);
            }
        }
    }

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

    async startTask(taskid, cb) {
        let response = await network.post("/api/start", {
            taskid: taskid,
            start: Date.now()
        });

        if(response.success && cb) {
            cb();
        }
    }

    async getTasks(cb) {
        let response = await network.get("/api/task/all/");
        if(response.success && cb) {
            let tasks = response.data;
            let tasksMap = {};

            for(let task of tasks) {
                tasksMap[task._id] = task;
            }

            cb(tasks, tasksMap);
        }
    }

    async getTask(id, cb) {
        let response = await network.get("/api/task/"+id);

        if(response.success && cb) {
            cb(response.data);
        }
    }

    async deleteTask(id, cb) {
        let response = await network.delete("/api/task/"+id);
        if(response.success && cb) {
            cb();
        }
    }

    async addTask(task, cb) {
        let response = await network.post("/api/task/", task);
        if(response.success && cb) {
            cb(response.data);
        }
    }

    async updateTask(task, cb) {
        let response = await network.post("/api/task/update/"+task._id, task);

        if(response.success && cb) {
            cb(response.data);
        }
    }

    async getEntry(id, cb) {
        let response = await network.get("/api/entry/"+id);

        if(response.success && cb) {
            cb(response.data);
        }
    }

    async deleteEntry(id, cb) {
        let response = await network.delete("/api/entry/"+id);
        if(response.success && cb) {
            cb();
        }
    }

    async addEntry(entry, cb) {
        let response = await network.post("/api/entry/", entry);
        if(response.success && cb) {
            cb(response.data);
        }
    }

    async updateEntry(entry, cb) {
        let response = await network.post("/api/entry/update/"+entry._id, entry);

        if(response.success && cb) {
            cb(response.data);
        }
    }

    async deleteProject(id, cb) {
        let response = await network.delete('/api/project/' + id);
        if(response.success && cb) {
            cb();
        }
    }

    async addProject(project, cb) {
        let response = await network.post('/api/project', project);
        if(response.success && cb) {
            cb(response.data);
        }
    }

    async updateProject(project, cb) {
        let response = await network.post("/api/project/update/"+project._id, project);

        if(response.success && cb) {
            cb(response.data);
        }
    }

    async getProject(id, cb) {
        let response = await network.get('/api/project/'+id);
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

    async getAddress(id, cb) {
        let response = await network.get("/api/address/"+id);

        if(response.success && cb) {
            cb(response.data);
        }
    }

    async addAddress(address, cb) {
        let response = await network.post("/api/address", address);

        if(response.success && cb) {
            cb(response.data);
        }
    }

    async updateAddress(id, address, cb) {
        let response = await network.post("/api/address/update/"+id, address);

        if(response.success && cb) {
            cb(response.data);
        }
    }

    async deleteAddress(id, cb) {
        let response = await network.delete("/api/address/"+id);

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

    async getInvoice(id, cb) {
        let response = await network.get("/api/invoice/"+id);

        if(response.success && cb) {
            cb(response.data);
        }
    }

    async addInvoice(data, cb) {
        console.log(data);
        let response = await network.post("/api/invoice", data);

        if(response.success && cb) {
            cb(response.data);
        }
    }

    async updateInvoice(id, data, cb) {
        let response = await network.post("/api/invoice/update/"+id, data);

        if(response.success && cb) {
            cb(response.data);
        }
    }

    async deleteInvoice(id, cb) {
        let response = await network.delete("/api/invoice/"+id);

        if(response.success && cb) {
            cb(response.data);
        }
    }

    async getSettings(cb) {
        let response = await network.get("/api/setting/all/");
        if(response.success && cb) {
            cb(response.data);
        }
    }

    async getSetting(id, cb) {
        let response = await network.get("/api/setting/"+id);

        if(response.success && cb) {
            cb(response.data);
        }
    }

    async addSetting(data, cb) {
        console.log(data);
        let response = await network.post("/api/setting", data);

        if(response.success && cb) {
            cb(response.data);
        }
    }

    async updateSetting(data, cb) {
        let response = await network.post("/api/setting/update/"+data._id, data);

        if(response.success && cb) {
            cb(response.data);
        }
    }

    async deleteSetting(id, cb) {
        let response = await network.delete("/api/setting/"+id);

        if(response.success && cb) {
            cb(response.data);
        }
    }
}

export default new ServerProxy();