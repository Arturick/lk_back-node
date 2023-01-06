const userDB = require('../dto/user');

class Role {
    async secondRole(user, req, res, next){
        try {
            if(user.role < 2){
                throw Error();
            }
            next();
        } catch (e) {
            return res.status(403).json({error: 'role'});
        }
    }
    async thirdRole(user, req, res, next){
        try {
            if(user.role < 3){
                throw Error();
            }
            next();
        } catch (e) {
            return res.status(403).json({error: 'role'});
        }
    }
    async fourthRole(user, req, res, next){
        try {
            if(user.role < 4){
                throw Error();
            }
            next();
        } catch (e) {
            return res.status(403).json({error: 'role'});
        }
    }
}

module.exports = new Role();