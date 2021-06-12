const StartTaskService = require('../services/startTaskService');
const Response = require("../model/response/response");

class StartTaskHandler {
    async handle(req, res) {
        let service = new StartTaskService();

        let userid = req.body.userid||null;
        let name = req.body.name||null;
        let project = req.body.project||null;

        //TODO: Store the users time zone and use that to calculate the start time from the server instead of requesting it from the user.
        let start = req.body.start||null; 

        if(userid == null || name == null || start == null) {
            res.send(Response.InvalidRequest("Invalid request body."));
            return;
        }

        try {
            await service.startTask(userid, name, start, project);
            res.send(Response.Success());
        }
        catch {
            res.send(Response.Error("Error starting task."));
        }
    }
}

module.exports = StartTaskHandler;