const GetTaskService = require('../services/getTaskService');
const Response = require("../model/response/response");

class GetTaskHandler {
    async handle(req, res) {
        let service = new GetTaskService();

        let userid = req.params.userid||null;
        let taskid = req.params.taskid||null;

        if(userid == null || taskid == null) {
            res.send(Response.InvalidRequest("Invalid request."));
            return;
        }

        try {
            let task = await service.getTask(userid, taskid);

            if(task!==null) {
                res.send(Response.Success(task));
            }
            else {
                res.send(Response.Error("No task found."));
            }
        }
        catch {
            res.send(Response.Error("Error getting task."));
        }
    }
}

module.exports = GetTaskHandler;