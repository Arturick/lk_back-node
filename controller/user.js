const answer = require("../service/Answer");
const userModule = require("../module/user");


class User {
    async register(req, res, next){
        try  {
            const {phone, code} = req.body;
            let answer = await userModule.register(phone, code);
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

    async getProfile(user, req, res, next){
        try {
            return res.json(user);
        } catch (e) {
            next(e);
        }

    }

    async resetPassword(req, res, next){
        try {
            const {phone, task1, code} = req.body;
            let answer = await userModule.resetPassword(phone, task1, code);
            return res.json(answer);
        } catch (e) {
            next(e)
        }
    }

    async updateProfile(user, req, res, next){
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
            const {phone, name, surname, task1} = req.body;
            let answer = await userModule.sendCode(phone, name, surname, task1);
            return res.json(answer);
        } catch (e) {
            next(e);
        }

    }
    async sendUpdateLog(user, req, res, next){
        try {
            const {phone} = req.body;
            let answer = await userModule.sendUpdateLog(phone);
            return res.json(answer);
        } catch (e) {
            next(e);
        }
    }
    async updateLog(user, req, res, next){
        try {
            const {userNew, code} = req.body;
            let answer = await userModule.updateLog(userNew, code);
            return res.json(answer);
        } catch (e) {
            next(e);
        }
    }
    async logout(req, res, next){
        const {token} = req.body;
    }

    async sendResetCode(req, res, next){
        try {
            const {phone, name, surname, task1} = req.body;
            let answer = await userModule.sendResetCode(phone, name, surname, task1);
            return res.json(answer);
        } catch (e) {
            next(e);
        }

    }

    async getManagerLink(req, res, next){
        try {
            const {code} = req.body;
            let answer = await userModule.getManagerLinkInfo(code);
            return res.json(answer);
        } catch (e) {
            next(e);
        }

    }

    async accessManager(req, res, next){
        try {
            const {phone, access, name, surname, role, userId, task1} = req.body;
            let answer = await userModule.accessManager(phone, access, name, surname, role, userId, task1);
            return res.json(answer);
        } catch (e) {
            next(e);
        }

    }
}

module.exports = new User();