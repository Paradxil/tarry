const StartTaskService = require('../services/startTaskService');
const Response = require("../model/response/response");

class StartTaskHandler {
    async handle(req, res) {
        let service = new StartTaskService();

        let userid = req.user._id||null;
        let taskid = req.body.taskid||null;

        //TODO: Store the users time zone and use that to calculate the start time from the server instead of requesting it from the user.
        let start = req.body.start||null; 

        if(userid == null || taskid == null || start == null) {
            console.log("NO");
            res.send(Response.InvalidRequest("Invalid request body."));
            return;
        }

        try {
            await service.startTask(userid, taskid, start);
            res.send(Response.Success());
        }
        catch(err) {
            console.log(err);
            res.send(Response.Error("Error starting task."));
        }
    }
}

module.exports = StartTaskHandler;