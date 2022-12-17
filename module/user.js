const userDB = require('../dto/user');
const codeS = require('../service/Code')
const tokenS = require('../service/Token');

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
            return {...tokens, id: isPhone[0]['id']};
        }
        let task1 = Math.floor(Math.random() * (9999999999 - 1111111111) + 1111111111);
        await userDB.register(task1, phone);
        let user = await userDB.getByTask1(task1);
        const tokens = await tokenS.generateTokens(user[0]['id']);
        await tokenS.saveToken(user[0]['id'], tokens['refreshToken']);
        return {...tokens, id: user[0]['id']};
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

    async refresh(token){
       if(!token){
           console.log(403);
       }
       let isToken = await tokenS.findToken(token);
       if(isToken.length < 1){
           throw Error();
       }

    }

    async getProfile(token, id){
        if(!token){
            console.log(id, 403);
        }
        let isToken = await tokenS.validateRefreshToken(token);
        if(!isToken) {
           // throw Error();
        }
        let user = await userDB.getById(id);
        return user[0];

    }

    async updateProfile(profile){
        if(!profile){
            console.log(403);
        }
        await userDB.updateProfile(profile);
        return {}
    }

    async logout(){

    }

    async sendCode(phone){
        if(!phone){
            console.log('403');
        }
        let code = Math.floor(Math.random() * (9999 - 1111) + 1111);
        await codeS.saveCode(phone, code);

        return {}
    }
}

module.exports = new User();