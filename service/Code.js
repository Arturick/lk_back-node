const codeDB = require('../dto/code');
const axios = require('axios');
//http://api.smsfeedback.ru/messages/v2/send/?phone=79787025740&text=test&login=rate-this&password=KoBe6263
class Code {
    async saveCode(phone, code, task1, password ){
        let text = `Добро пожаловать в RATE-THIS! \n Код для входа в личный кабинет ${code} \n Логин для входа: ${phone}\n Пороль для входа: ${password} \n Ваш индивидуальный номер договора: ${task1} \nЕсли это не вы сообщите нам! https://t.me/ratethisgroup`;

        await codeDB.deleteCode(phone);
        await codeDB.setCode(phone, code);
        await axios.get(`http://api.smsfeedback.ru/messages/v2/send/?phone=${phone}&text=${text}&login=rate-this&password=KoBe6263`);
    }

    async checkCode(phone, code){
        console.log(phone);
        let isCode = await codeDB.checkCode(phone, code);
        if(!isCode){
            return null
        }
        return isCode;
    }
}

module.exports = new Code();