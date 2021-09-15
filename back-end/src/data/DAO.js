/**
 * A generic DAO class. 
 * Use the 'create' method to create a
 * DAO object for any mongoose schema.
 */
class DAO {
    constructor() {
        this.schema = null;
    }

    /**
     * Create a new DAO document for the given schema.
     * @param {Schema} schema 
     * @returns A DAO instance.
     */
    static create(schema) {
        let daoObject = new DAO();
        daoObject.schema = schema;
        return daoObject;
    }

    /**
     * Returns an document from the schema given an ID.
     * @param {String} id 
     * @returns The document found or 'null'.
     */
    async get(id) {
        return await this.schema.findOne({_id: id});
    }

    /**
     * Removes a document from the schema, if it exists.
     * @param {String} id 
     * @returns The deleted document.
     */
    async remove(id) {
        return await this.schema.deleteOne({_id: id});
    }

    /**
     * Returns all documents in the schema with a matching userid.
     * @param {String} userid 
     * @returns All documents associated with the given userid.
     */
    async all(userid) {
        return await this.schema.find({userid: userid});
    }

    /**
     * Add a new document to the schema.
     * @param {Object} data JSON representation of the document.
     * @returns The added document.
     */
    async add(data) {
        let obj = new this.schema(data);
        await obj.save();
        return obj;
    }

    /**
     * Update an existing document. Does not add new fields.
     * @param {Object} data JSON with fields to update and their new values.
     * @returns The updated document.
     */
    async update(id, data) {
        let obj = await this.get(id);

        for(let key in data) {
            if(key in obj) {
                obj[key] = data[key];
            }
        }

        await obj.save();
        return obj;
    }
}

module.exports = DAO;