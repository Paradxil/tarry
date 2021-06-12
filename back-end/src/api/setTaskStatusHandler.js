const SetTaskStatusService = require('../services/setTaskStatusService');
const Response = require("../model/response/response");

class SetTaskStatusHandler {
    async handle(req, res) {
        let service = new SetTaskStatusService();

        let status = req.body.status||null;
        let userid = req.body.userid||null;
        let taskid = req.body.taskid||null;

        if(taskid == null || userid == null || status == null) {
            res.send(Response.InvalidRequest("Invalid request body."));
            return;
        }

        try {
            let task = await service.setStatus(taskid, userid, status);
            res.send(Response.Success(task));
        }
        catch(err) {
            res.send(Response.Error("Error setting task status."));
        }
    }
}

module.exports = SetTaskStatusHandler;