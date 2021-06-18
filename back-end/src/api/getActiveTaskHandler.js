const GetActiveTaskService = require('../services/getActiveTaskService');
const Response = require("../model/response/response");

class GetActiveTaskHandler {
    async handle(req, res) {
        let service = new GetActiveTaskService();

        let userid = req.user._id;

        if(userid == null) {
            res.send(Response.InvalidRequest("Invalid request."));
            return;
        }

        try {
            let task = await service.getTask(userid);

            if(task!==null) {
                res.send(Response.Success(task));
            }
            else {
                res.send(Response.Error("No active task found."));
            }
        }
        catch(err) {
            res.send(Response.Error("Error getting active task."));
        }
    }
}

module.exports = GetActiveTaskHandler;