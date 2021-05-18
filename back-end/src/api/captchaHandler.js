const CaptchaService = require("../services/captchaService");
const Response = require("../model/response/response");

class CaptchaHandler {
    static async handle(req, res, next) {
        let captchaService = new CaptchaService();

        try {
            //TODO: Check for invalid requests
            let captchaid = req.body.captchaid;
            let verified = await captchaService.verifyCaptcha(captchaid);

            if(!verified) {
                throw new Error("Incorrect captcha.");
            }
            else {
                next();
            }
        }
        catch(err) {
            res.send(Response.Error("Error validating captcha."));
            console.log(err);
        }
    }
}

module.exports = CaptchaHandler;