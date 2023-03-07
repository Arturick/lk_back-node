const userDB = require('../dto/user');

class Role {
    async secondRole(req, res, next){
        try {
            const {userId} = req.body;
            let user = await userDB.getById(userId);
            if(user.role < 2){
                return res.status(403).json({error: 'role'});
            }
            next(user);
        } catch (e) {
            return res.status(403).json({error: 'role'});
        }
    }
    async thirdRole(req, res, next){
        try {
            const {userId} = req.body;
            let user = await userDB.getById(userId);
            console.log(user);
            if(user.role < 3){
                return res.status(403).json({error: 'role'});
            }
            next(user);
        } catch (e) {
            return res.status(403).json({error: 'role'});
        }
    }
    async fourthRole(req, res, next){
        try {
            const {userId} = req.body;
            let user = await userDB.getById(userId);
            if(user.role < 4){
                return res.status(403).json({error: 'role'});
            }
            next(user);
        } catch (e) {
            return res.status(403).json({error: 'role'});
        }
    }
}

module.exports = new Role();