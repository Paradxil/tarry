const ProjectDAO = require('../data/projectDAO');

class AllProjectsService {
    async getAllProjects(userid) {
        let projectDAO = new ProjectDAO();
        return await projectDAO.getAll(userid);
    }
}

module.exports = AllProjectsService;