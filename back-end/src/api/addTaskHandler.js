const AddTaskService = require('../services/addTaskService');
const Response = require("../model/response/response");

class AddTaskHandler {
    async handle(req, res) {
        let service = new AddTaskService();

        let name = req.body.name||null;
        let userid = req.body.userid||null;
        let start = req.body.start||null;
        let end = req.body.end||null;

        if(name === null || userid === null || start === null || end === null) {
            res.send(Response.InvalidRequest("Invalid request body."));
            return;
        }

        try {
            let task = await service.addTask(name, userid, start, end);
            res.send(Response.Success({task: task}));
        }
        catch(err) {
            res.send(Response.Error("Error adding task."));
        }
    }
}

module.exports = AddTaskHandler;