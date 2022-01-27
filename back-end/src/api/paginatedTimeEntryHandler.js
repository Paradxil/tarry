const PaginatedTimeEntryService = require('../services/paginatedTimeEntryService');
const Response = require("../model/response/response");

class PaginatedTimeEntryHandler {
    async handle(req, res) {
        let service = new PaginatedTimeEntryService();

        let userid = req.user._id;
        let last = req.body.last||null;
        let max = req.body.max;

        console.log(last);

        try {
            let result = await service.getPaginatedTimeEntries(userid, max, last);

            if(result!==null) {
                res.send(Response.Success(result));
            }
            else {
                res.send(Response.Error("No entries found."));
            }
        }
        catch(err) {
            console.log(err);
            res.send(Response.Error("Error getting paginated entries."));
        }
    }
}

module.exports = PaginatedTimeEntryHandler;