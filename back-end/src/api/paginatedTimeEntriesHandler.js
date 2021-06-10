const PaginatedTimeEntriesService = require("../services/paginatedTimeEntriesService");
const Response = require("../model/response/response");

class PaginatedTimeEntriesHandler {
    async handle(req, res) {
        let service = new PaginatedTimeEntriesService();

        let userid = req.body.userid||null;
        let maxEntries = req.body.max||10;
        let lastEntry = req.body.last||null;

        if(userid === null) {
            res.send(Response.InvalidRequest("Bad request.", {name: "userid", expectedType: "String"}));
            return;
        }

        try {
            let entries = await service.getEntries(userid, maxEntries, lastEntry);
            res.send(Response.Success(entries));
        }
        catch {
            res.send(Response.Error("Error getting entries."));
        }
    }
}

module.exports = PaginatedTimeEntriesHandler;