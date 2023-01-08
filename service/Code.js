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
        let text = `Добро пожаловать в RATE-THIS! \n Код для входа в личный кабинет ${code} \nЕсли это не вы сообщите нам! https://t.me/ratethisgroup`;

        await codeDB.deleteCode(phone);
        await codeDB.setCode(phone, code);
        await axios.get(`http://api.smsfeedback.ru/messages/v2/send/?phone=${phone}&text=${text}&login=rate-this&password=KoBe6263`);
    }

    async sendSelfMassage(phone, text){
        await axios.get(`http://api.smsfeedback.ru/messages/v2/send/?phone=${phone}&text=${text}&login=rate-this&password=KoBe6263`);
    }
}

module.exports = new Code();