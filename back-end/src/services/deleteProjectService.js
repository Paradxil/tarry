const ProjectDAO = require('../data/projectDAO');

class DeleteProjectService {
    async deleteProject(projectid) {
        let projectDAO = new ProjectDAO();
        await projectDAO.remove(projectid);
    }
}

module.exports = DeleteProjectService;