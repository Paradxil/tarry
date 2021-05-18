/**
 * Factory methods used to standardize response messages.
 * Returns a JSON object.
 */
 class ResponseFactory {
    /**
     * Defines a successful request.
     * @param {Object} data //Optional. Response data from the request.
     * @returns 
     */
    static Success(data = {}) {
        return this.Response(true, null, data);
    }

    static Unauthorized() {
        return this.Error("You are not authorized to make this request.");
    }

    /**
     * Defines a response for an invalid request.
     * Accepts an error message and list of invalid parameters.
     * The invalid parameters defines what arguments where missing
     * or incorrect from the response. For example: 
     * {name: 'userid', expectedType: 'String'}
     * would indicate that the request was missing the userid object
     * or that the userid in the request was the wrong type.
     * This also indicates that the userid should be of type String.
     * @param {String} message 
     * @param  {...{name: String, expectedType: String, value: Object}} invalid
     * @returns 
     */
    static InvalidRequest(message, ...invalid) {
        return this.Response(false, message, {invalidParameters: invalid});
    }

    /**
     * Creates a generic error response with a message.
     * @param {String} message 
     * @returns 
     */
    static Error(message) {
        return this.Response(false, message);
    }

    /**
     * Defines a generic response.
     * @param {String} success //Was the request successful?
     * @param {String} message //A message 
     * @param {Object} data //Any data related to the request
     * @returns 
     */
    static Response(success, message = "", data = {}) {
        return {
            success: success||false,
            message: message||"",
            data: data||{}
        }
    }
}

module.exports = ResponseFactory;