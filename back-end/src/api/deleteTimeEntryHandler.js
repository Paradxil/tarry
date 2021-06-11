const DeleteTimeEntryService = require('../services/deleteTimeEntryService');
const Response = require("../model/response/response");

class DeleteTimeEntryHandler {
    async handle(req, res) {
        let service = new DeleteTimeEntryService();

        let entryid = req.params.id;

        if(entryid === null) {
            res.send(Response.InvalidRequest("Invalid request."));
            return;
        }

        try {
            await service.deleteEntry(entryid);
            res.send(Response.Success());
        }
        catch(err) {
            res.send(Response.Error("Error deleting time entry."));
        }
    }
}

module.exports = DeleteTimeEntryHandler;