const spamDB = require('../dto/spam');

module.exports = async function(req, res, next) {
    try {
        let ip = req.ip.split(':')[0];
        let countReq = await spamDB.getReqByIp(ip);
        await spamDB.deleteOldReq();
        if(countReq.length > 5){
            throw Error();
        }
        await spamDB.addReq(ip);
        next();
    } catch (e) {
        return res.status(200).json({error: 'Слишком много попыток входа\n Попробуйте еще раз через время'})
    }
}