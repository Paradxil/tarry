const AllTimeEntriesService = require('../services/allTimeEntriesService');
const Response = require("../model/response/response");

class AllTimeEntriesHandler {
    async handle(req, res) {
        let service = new AllTimeEntriesService();

        let userid = req.params.userid||null;

        if(userid === null) {
            res.send(Response.InvalidRequest("Bad request.", {name: "userid", expectedType: "Number"}));
            return;
        }

        try {
            let tasks = await service.getAllEntries(userid);
            res.send(Response.Success(tasks));
        }
        catch {
            res.send(Response.Error("Error getting tasks."));
        }
    }
}

module.exports = AllTimeEntriesHandler;