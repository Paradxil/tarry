const LoginService = require("../services/loginService");
const Migrations = require("../model/migrations");

class LoginHandler {
    async handle(username, password, done) {
        let service = new LoginService();
        
        try {
            let user = await service.login(username, password);
            if(user !== null && user !== undefined) {

                //Check that the users information is up to date
                if(Migrations.ShouldMigrate(user.schemaVersion)) {
                    await Migrations.Migrate(user._id, user.schemaVersion);
                }

                return done(null, user);
            }
        }
        catch(err) {
            return done(err);
        }

        return done(null, false);
    }
}

module.exports = LoginHandler;