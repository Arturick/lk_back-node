const spamDB = require('../dto/spam');

module.exports = async function (req, res, next) {
    try {
        let ip = req.ip.split(':')[0];
        let countReq = await spamDB.getReqByIp(ip);
        await spamDB.deleteOldReq();
        if(countReq.length > 5){
            throw Error();
        }
        next();
    } catch (e) {
        return res.status(403).json({error: 'a lot of req in a time moment'})
    }
}