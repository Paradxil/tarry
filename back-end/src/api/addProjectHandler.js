const AddProjectService = require('../services/addProjectService');
const Response = require("../model/response/response");

class AddProjectHandler {
    async handle(req, res) {
        let service = new AddProjectService();

        let name = req.body.name||null;
        let userid = req.body.userid||null;
        let color = req.body.color||null;
        let wage = req.body.wage||0;

        if(name === null || userid === null || color === null || wage === null) {
            res.send(Response.InvalidRequest("Invalid request body."));
            return;
        }

        try {
            let project = await service.addProject(name, userid, color, wage);
            res.send(Response.Success({project: project}));
        }
        catch(err) {
            res.send(Response.Error("Error adding project."));
        }
    }
}

module.exports = AddProjectHandler;