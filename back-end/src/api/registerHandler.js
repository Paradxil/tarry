const RegisterService = require("../services/registerService");

const Response = require("../model/response/response");

class RegisterHandler {
    async handle(req, res) {
        let service = new RegisterService();

        try {
            let username = req.body.username;
            let password = req.body.password;
            let email = req.body.email;

            //TODO: Check for invalid request data.

            await service.register(username, password, email);
            res.send(Response.Success());
        }
        catch(err) {
            console.log(err);
            res.send(Response.Error("Error register user.")); //TODO: Include more details, was the username already taken etc.
        }
    }
}

module.exports = RegisterHandler;