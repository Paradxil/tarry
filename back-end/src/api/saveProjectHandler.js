const AddProjectService = require('../services/addProjectService');
const UpdateProjectService = require('../services/updateProjectService');
const Response = require("../model/response/response");

/**
 * Either updates or creates a new project.
 * If the post data includes a projectid then the project is udpated, otherwise a new project is created.
 */
class SaveProjectHandler {
    async handle(req, res) {
        let service = new AddProjectService();
        let updateService = new UpdateProjectService();

        let name = req.body.name||null;
        let userid = req.body.userid||null;
        let color = req.body.color||null;
        let wage = req.body.wage||0;
        let projectid = req.body.projectid||null

        if(name === null || userid === null || color === null || wage === null) {
            res.send(Response.InvalidRequest("Invalid request body."));
            return;
        }

        try {
            let project = projectid==null?await service.addProject(name, userid, color, wage):await updateService.updateProject(projectid, userid, name, color, wage);
            res.send(Response.Success({project: project}));
        }
        catch(err) {
            console.log(err);
            res.send(Response.Error("Error adding project."));
        }
    }
}

module.exports = SaveProjectHandler;