const spamDB = require('../dto/spam');

module.exports = async function(req, res, next) {
    try {

        let countReq = await spamDB.getReqByIp(req.ip);
        await spamDB.deleteOldReq();
        console.log(countReq.length > 5);
        if(countReq.length > 5){
            throw Error();
        }
        await spamDB.addReq(req.ip);
        next();
    } catch (e) {
        console.log(e);
        return res.status(200).json({error: 'Слишком много попыток входа\n Попробуйте еще раз через время'})
    }
}