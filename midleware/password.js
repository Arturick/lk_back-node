const userDB = require('../dto/user');
const passwordSpamDB = require('../dto/spam');
const axios = require('axios');
module.exports =  async function (req, res, next) {
    const {login, password} = req.body;
    try {
        let spamCount = await passwordSpamDB.getSpam(login);
        let text = `https://api.telegram.org/bot5816088241:AAGFDEcfumVfDRYfdleiUj9N_701JDyYlX4/sendMessage?chat_id=366950309&text=${login} Ломится`;

        if(spamCount.length > 2){
            await axios.get(text);
            return res.status(200).json({error: 'forbidden'});
        }
        let isAuth = await userDB.login(login, password);
        if(isAuth.length < 1){
            await passwordSpamDB.addSpam(login);
            return res.status(200).json({error: 'wrong password', count: spamCount.length});
        }
        next();
    } catch (e) {
        console.log(e);
    }
}