const jwt = require('jsonwebtoken');
const tokenDB = require('../dto/token');
const jwtSalt = require('../data/config').jwt;

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign({userId: payload}, jwtSalt.accessSalt, {expiresIn: '1d'})
        const refreshToken = jwt.sign({userId: payload},jwtSalt.refreshSalt, {expiresIn: '14d'})
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, jwtSalt.accessSalt);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, jwtSalt.refreshSalt);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        await tokenDB.deleteToken(userId);
        await tokenDB.saveToken(refreshToken, userId);
    }

    async removeToken(userId) {
        await tokenDB.deleteToken(userId);
    }

    async findToken(userId, refreshToken) {
        const tokenData = await tokenDB.getToken(userId, refreshToken);
        if(tokenData.length < 1){
            return null;
        }
        return tokenData;
    }
}

module.exports = new TokenService();