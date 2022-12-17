const jwt = require('jsonwebtoken');
const tokenDB = require('../dto/token');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign({id: payload}, 'salt', {expiresIn: '1d'})
        const refreshToken = jwt.sign({id: payload},'salt', {expiresIn: '2d'})
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, 'salt');
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, 'salt');
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenDB.getToken(userId);
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenDB.saveToken(refreshToken, userId);
        }
        const token = await tokenDB.saveToken(refreshToken, userId);
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenDB.deleteToken(refreshToken);
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await tokenDB.getToken(refreshToken)
        return tokenData;
    }
}

module.exports = new TokenService();