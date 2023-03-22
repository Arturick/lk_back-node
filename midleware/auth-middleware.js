const tokenService = require('../service/Token');
const userDB = require("../dto/user");

module.exports = async function(req, res, next){
    try {
        const {userId} = req.body;
        let accessToken = req.headers.authorization.split(' ')[1];
        console.log(accessToken);
        let isAuth = await tokenService.validateAccessToken(accessToken);
        if(!isAuth || isAuth.userId != userId){
            throw Error();
        }

        let user = await userDB.getById(userId);
        console.log(user);
        next(user);
    } catch (e) {
        return res.status(401).json({message: 'Ошибка авторизации'})
    }
}