const codeDB = require('../dto/code');
const axios = require('axios');
//http://api.smsfeedback.ru/messages/v2/send/?phone=79787025740&text=test&login=rate-this&password=KoBe6263
class Code {
    async saveCode(phone, code, isReg, login = 1, password = 1){
        let text = isReg ? `Добро пожаловать в RATE-THIS! \n Код для входа в личный кабинет ${code} \n Логин для входа: ${login}\n Пороль для входа: ${password}\nЕсли это не вы сообщите нам! https://t.me/ratethisgroup` : `Добро пожаловать в RATE-THIS! \n Код для входа в личный кабинет ${code} \nЕсли это не вы сообщите нам! https://t.me/ratethisgroup`;
        await axios.get(`http://api.smsfeedback.ru/messages/v2/send/?phone=${phone.replace('+','').replace(' ', '').replace('-','')}&text=${text}&login=rate-this&password=KoBe6263`)
        await codeDB.setCode(phone.replace('+','').replace(' ', '').replace('-',''), code);
    }

    async checkCode(phone, code){
        console.log(phone.replace('+','').replace(' ', '').replace('-','').replace('-', '').replace(' ', ''));
        let isCode = await codeDB.checkCode(phone.replace('+','').replace(' ', '').replace('-','').replace('-', '').replace(' ', ''), code);
        if(!isCode){
            return null
        }
        return isCode;
    }
}

module.exports = new Code();