const DeleteTaskService = require('../services/deleteTaskService');
const Response = require("../model/response/response");

class AddTaskHandler {
    async handle(req, res) {
        let service = new DeleteTaskService();

        let taskid = req.params.id;

        if(taskid === null) {
            res.send(Response.InvalidRequest("Invalid request."));
            return;
        }

        try {
            await service.deleteTask(taskid);
            res.send(Response.Success());
        }
        catch(err) {
            res.send(Response.Error("Error deleting task."));
        }
    }
}

module.exports = AddTaskHandler;