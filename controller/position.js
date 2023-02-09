const service = require('../module/position');

class Position {
    async addKey(user, req, res, next){
        try {
            const {key, article} = req.body;
            let answer = await service.addKey(user, key, article);

            return res.json(answer);
        } catch (e){
            next(e);
        }
    }
    async editKey(user, req, res, next){

    }

    async deleteKey(user, req, res, next){

    }

    async getKey(user, req, res, next){

    }
}

module.exports = new Position();