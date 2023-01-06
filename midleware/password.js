const userDB = require('../dto/user');
const passwordSpamDB = require('../dto/spam');

module.exports =  async function (req, res, next) {
    const {login, password} = req.body;
    try {
        let spamCount = await passwordSpamDB.getSpam(login);
        if(spamCount.length > 2){
            return res.status(200).json({error: 'forbidden'});
        }
        let isAuth = await userDB.login(login, password);
        if(isAuth.length < 1){
            await passwordSpamDB.addSpam(login);
            return res.status(200).json({error: 'wrong password', count: spamCount.length});
        }
        next();
    } catch (e) {
        await passwordSpamDB.addSpam(login);
        return res.status(200).json({error: 'wrong password', count});
    }
}