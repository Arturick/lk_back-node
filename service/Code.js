const codeDB = require('../dto/code');
const axios = require('axios');
//http://api.smsfeedback.ru/messages/v2/send/?phone=79787025740&text=test&login=rate-this&password=KoBe6263
class Code {
    async saveCode(phone, code){
        await axios.get(`http://api.smsfeedback.ru/messages/v2/send/?phone=79787025740&text=${code}&login=rate-this&password=KoBe6263`)
        await codeDB.setCode(phone, code);
    }

    async checkCode(phone, code){
        let isCode = await codeDB.checkCode(phone, code);
        if(!isCode){
            return null
        }
        return isCode;
    }
}

module.exports = new Code();