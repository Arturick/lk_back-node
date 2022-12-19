const answer = require("../service/Answer");
const userModule = require("../module/user");


class User {
    async register(req, res, next){
        try  {
            const {phone, code} = req.body;
            let answer = await userModule.register(phone.replace('+','').replace(' ', '').replace('-','').replace('-', '').replace(' ', ''), code);
            res.cookie('refreshToken', answer.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(answer);

        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next){
        try {
            const {login, password} = req.body;
            console.log(req.body);
            let answer = await userModule.login(login, password);
            res.cookie('refreshToken', answer.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(answer);
        } catch (e) {
            next(e);
        }

    }

    async getProfile(req, res, next){
        try {
            const {token, id} = req.body;
            console.log(id);
            let answer = await userModule.getProfile(token, id);
            return res.json(answer);
        } catch (e) {
            next(e);
        }

    }


    async updateProfile(req, res, next){
        try {
            const {profile} = req.body;
            let answer = await userModule.updateProfile(profile);
            return res.json(answer);
        } catch (e) {
            next(e);
        }

    }

    async sendCode(req, res, next){
        try {
            const {phone, reg} = req.body;
            let answer = await userModule.sendCode(phone, reg);
            return res.json(answer);
        } catch (e) {
            next(e);
        }

    }

    async logout(req, res, next){
        const {token} = req.body;
    }
}

module.exports = new User();