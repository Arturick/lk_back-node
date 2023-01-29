const codeDB = require('../dto/code');
const axios = require('axios');
//http://api.smsfeedback.ru/messages/v2/send/?phone=79787025740&text=test&login=rate-this&password=KoBe6263
class Code {
    async saveCode(phone, code, task1, password ){
        //Kod dlya vhoda 1218. Esli eto ne vy soobshchite nam! https://t.me/ratethisgroup
        let text = `Kod dlya vhoda ${code} \n LOGIN: ${phone}\n PASSWORD: ${password} \n ID: ${task1} \nEsli eto ne vy soobshchite nam! https://t.me/ratethisgroup https://t.me/ratethisgroup`;

        await codeDB.deleteCode(phone);
        await codeDB.setCode(phone, code);
        await axios.get(`http://api.smsfeedback.ru/messages/v2/send/?phone=${phone}&text=${text}&login=rate-this&password=KoBe6263`);
    }
    async saveUpdateCode(phone, code){
        let text = `YOUR CODE: ${code}`;
        await codeDB.deleteCode(phone);
        await codeDB.setCode(phone, code);
        await axios.get(`http://api.smsfeedback.ru/messages/v2/send/?phone=${phone}&text=${text}&login=rate-this&password=KoBe6263`);

    }
    async sendUsers(phone, users){
        let text = `Добро пожаловать в RATE-THIS! \n Ниже будут представленны ваши данныке для входа`;
        for(let i of users){
            text = `${text} \n Пороль: ${i['password']} U Логин: ${i['login']}`;
        }
        await axios.get(`http://api.smsfeedback.ru/messages/v2/send/?phone=${phone}&text=${text}&login=rate-this&password=KoBe6263`);
    }

    async checkCode(phone, code){
        console.log(phone);
        let isCode = await codeDB.checkCode(phone, code);
        if(isCode.length < 1){
            return null
        }
        return isCode;
    }

    async sendManagerLink(phone, link){
        console.log(phone);
        let text = `Добро пожаловать в RATE-THIS! \n Мы зафиксировали попытку регистрации менеджер аккаунт по вашему уникальному ключу, вам неоходимо подтвердить это по ссылке ниже\n https://app.rate-this.ru/user/login/access_manager?code=${link}`;
        await axios.get(`http://api.smsfeedback.ru/messages/v2/send/?phone=${phone}&text=${text}&login=rate-this&password=KoBe6263`);

    }

    async saveResetCode(phone, code){
        let text = `Kod:  ${code} \nEsli eto ne vy soobshchite nam! https://t.me/ratethisgroup`;

        await codeDB.deleteCode(phone);
        await codeDB.setCode(phone, code);
        await axios.get(`http://api.smsfeedback.ru/messages/v2/send/?phone=${phone}&text=${text}&login=rate-this&password=KoBe6263`);
    }

    async sendSelfMassage(phone, text){
        await axios.get(`http://api.smsfeedback.ru/messages/v2/send/?phone=${phone}&text=${text}&login=rate-this&password=KoBe6263`);
    }
}

module.exports = new Code();