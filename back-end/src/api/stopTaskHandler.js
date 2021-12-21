const StopTaskService = require('../services/stopTaskService');
const Response = require("../model/response/response");

class StopTaskHandler {
    async handle(req, res) {
        let service = new StopTaskService();

        let userid = req.user._id||null;
        let end = req.body.end||null;

        if(userid == null || end == null) {
            res.send(Response.InvalidRequest("Invalid request body."));
            return;
        }

        try {
            let task = await service.stopTask(userid, end);
            res.send(Response.Success(task));
        }
        catch(err) {
            console.log(err);
            res.send(Response.Error("Error stopping task."));
        }
    }
}

module.exports = StopTaskHandler;