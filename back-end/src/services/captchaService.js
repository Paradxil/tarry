const axios = require("axios");

class CaptchaService {
    async verifyCaptcha(id) {
        try {
            let result = await axios.post("https://iconcaptcha.com/captcha/verify", {
                id: id
            });

            if(result.status === 200) {
                if(result.data && result.data.verified === true) {
                    return true;
                }
            }
        }
        catch(err) {
            throw new Error(err);
        }

        return false;
    }
}

module.exports = CaptchaService;