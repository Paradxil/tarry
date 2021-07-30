const AllProjectsService = require('../services/allProjectsService');
const Response = require("../model/response/response");

class AllProjectsHandler {
    async handle(req, res) {
        let service = new AllProjectsService();

        let userid = req.params.userid||req.user._id||null;

        if(userid === null) {
            res.send(Response.InvalidRequest("Bad request.", {name: "userid", expectedType: "Number"}));
            return;
        }

        try {
            let projects = await service.getAllProjects(userid);
            res.send(Response.Success(projects));
        }
        catch {
            res.send(Response.Error("Error getting projects."));
        }
    }
}

module.exports = AllProjectsHandler;