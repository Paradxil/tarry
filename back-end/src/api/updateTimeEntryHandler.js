const Response = require("../model/response/response");
const UpdateTimeEntryService = require('../services/updateTimeEntryService');

class UpdateTimeEntryHandler {
    async handle(req, res) {
        let updateService = new UpdateTimeEntryService();

        let entryid = req.body.id||null;
        let name = req.body.name;
        let project = req.body.project;
        let start = req.body.start;
        let end = req.body.end;

        if(entryid == null) {
            res.send(Response.InvalidRequest("Please provide an entryid and a userid."));
        }

        try {
            let entry = await updateService.updateEntry(req.user._id, entryid, name, project, start, end);
            res.send(Response.Success(entry));
        }
        catch(err) {
            res.send(Response.Error("Error updating entry."));            
        }
    }
}

module.exports = UpdateTimeEntryHandler;