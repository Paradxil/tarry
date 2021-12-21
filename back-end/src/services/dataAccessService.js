class DataAccessService {
    /**
     * Initialize the DataAccessService.
     * @param {DAO} dao The DAO object to use.
     */
    constructor(dao) {
        this.dao = dao;
    }

    /**
     * Get a document from the database given an id.
     * @param {String} id 
     * @returns A document.
     */
    async get(id) {
        return await this.dao.get(id);
    }

    async all(userid) {
        return await this.dao.all(userid);
    }

    async add(userid, data) {
        data.userid = userid;
        return await this.dao.add(data);
    }

    async update(id, data) {
        return await this.dao.update(id, data);
    }

    async remove(id) {
        return await this.dao.remove(id);
    }
}

module.exports = DataAccessService;