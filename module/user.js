const userDB = require('../dto/user');
const codeS = require('../service/Code')
const tokenS = require('../service/Token');
const generator = require('generate-password');

class User {
    async register(phone, code){
        if(!phone || !code){
            console.log(403);
        }
        let isCode = await codeS.checkCode(phone, code);
        console.log(phone, code);
        if(!isCode){
            console.log(403);
            return 0;
        }
        let isPhone = await userDB.getByPhone(phone);
        if(isPhone.length > 0){
            const tokens = await tokenS.generateTokens(isPhone[0]['id']);
            await tokenS.saveToken(isPhone[0]['id'], tokens['refreshToken']);
            return {...tokens, userId: isPhone};
        }
        let task1 = Math.floor(Math.random() * (999999 - 111111) + 111111);
        await userDB.register(phone, 'user', 'user_surname', task1);
        let user = await userDB.getByTask1(task1);
        const tokens = await tokenS.generateTokens(user[0]['id']);
        await tokenS.saveToken(user[0]['id'], tokens['refreshToken']);
        return {...tokens, userId: user};
    }

    async login(login, password){
        if(!login || !password){
            console.log('403');
        }
        console.log(login, password);
        let isAuth = await userDB.login(login, password)
        console.log(isAuth);
        if(isAuth.length < 1){
            throw Error();
        }
        const tokens = await tokenS.generateTokens(isAuth[0]['id']);
        await tokenS.saveToken(isAuth[0]['id'], tokens['refreshToken']);
        return {...tokens, id: isAuth[0]['id']};
    }

    async refresh(userId, token){
       if(!token){
           console.log(403);
       }
       let isToken = await tokenS.findToken(userId, token);
       if(isToken.length < 1){
           throw Error();
       }
        const tokens = await tokenS.generateTokens(userId);
        await tokenS.saveToken(userId, tokens['refreshToken']);
        return {...tokens, userId: userId};

    }

    async updateProfile(profile){
        if(!profile){
            console.log(403);
        }
        await userDB.updateProfile(profile);
        return {}
    }

    async resetPassword(phone, task1, codeA) {
        console.log(phone, task1, codeA);
        if (!phone) {
            console.log(403);
        }
        let isCode = await codeS.checkCode(phone, codeA);
        console.log(isCode);
        if(isCode.length < 1){
            console.log(403);
            return {error: 'Не верный код'};
        }
        let isPhone = await userDB.getUser('','', phone, task1);
        if (isPhone.length < 1) {
            return {error: 'not found user'};
        }
        for(let i of isPhone){
            if(!i.login || !i.password){
                let pass = generator.generateMultiple(1, {
                    length: 6,
                    numbers: true,
                    uppercase: true
                });
                i.login = i.phone;
                i.password = pass;
            }
        }
        await codeS.sendUsers(phone, isPhone);

    }

    async sendCode(phone, name, surname, task1){
        if(!phone){
            console.log('403');
        }
        console.log(phone, name, surname, task1);
        let code = Math.floor(Math.random() * (9999 - 1111) + 1111);
        let isPhone = await userDB.getUser(name, surname, phone,  -1);
        console.log(isPhone);
        if(isPhone.length < 1){


            let isTask1 = await userDB.getByTask1(task1 ? task1 : -1);
            if(isTask1.length > 0){
                let link = generator.generateMultiple(1, {
                    length: 10,
                    numbers: true,
                    uppercase: true
                });
                await userDB.addManagerLink(isTask1[0]['id'], link, phone, name, surname);
                await codeS.sendManagerLink(isTask1[0]['phone'], link);
                return {error: 'forbidden'};
            }
            task1 = task1 ? task1 : Math.floor(Math.random() * (9999999 - 11111111) + 1111111);
            let pass = generator.generateMultiple(1, {
                length: 6,
                numbers: true,
                uppercase: true
            });
            await codeS.saveCode(phone, code, task1, pass);
            await userDB.register(phone, name, surname, task1, pass);
        } else {
            await codeS.saveCode(phone, code, isPhone[0]['task1'], isPhone[0]['password']);
        }


        return {}
    }

    async sendResetCode(phone, name, surname, task1){

        let code = Math.floor(Math.random() * (9999 - 1111) + 1111);
        let isPhone = await userDB.getUser(name, surname, phone, task1 ? task1 : -1);
        console.log(isPhone);
        if(isPhone.length < 1){
            return {error: 'Аккаунт не обнаружен'};
        } else {
            await codeS.saveResetCode(phone, code);
        }


        return {}
    }

    async getManagerLinkInfo(code){
        let answer = await userDB.getManagerLink(code);

        return answer;
    }

    async accessManager(phone, access, name, surname, role, userId, task1){
        let answer = access ? `Ваш аккаунт Успешно добавлен` : `Вам отказано в добавление Аккаунта`;
        if(access){
            let pass = generator.generateMultiple(1, {
                length: 6,
                numbers: true,
                uppercase: true
            });
            let user = await userDB.getById(userId);
            await userDB.addManager(phone, name, surname, user['task1'], pass, role, userId);
            answer = `Ваш аккаунт Успешно добавлен\n Пороль ${pass}\n Логин: ${phone}`;
        }
        await codeS.sendSelfMassage(phone, answer);

        return {};
    }
}

module.exports = new User();