const AllTasksService = require('../services/allTasksService');
const Response = require("../model/response/response");

class AllTasksHandler {
    async handle(req, res) {
        let service = new AllTasksService();

        let userid = req.params.userid||req.user._id||null;

        if(userid === null) {
            res.send(Response.InvalidRequest("Bad request.", {name: "userid", expectedType: "String"}));
            return;
        }

        try {
            let tasks = await service.getAllTasks(userid);
            res.send(Response.Success(tasks));
        }
        catch(err) {
            res.send(Response.Error("Error getting tasks."));
        }
    }
}

module.exports = AllTasksHandler;