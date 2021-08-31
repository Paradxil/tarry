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
}

module.exports = DataAccessService;