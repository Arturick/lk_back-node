const mysql         = require('mysql2');
const connection    = mysql.createPool({
    host : "j45316134.myjino.ru",
    database : "j45316134",
    user : "j45316134",
    password : "cf}j}R75tRzM"
}).promise();

class Token {
    async saveToken(token, userId){
        let sqlScript = `INSERT INTO tokens (userId, token) VALUES(${userId}, '${token}')`;
        await connection.query(sqlScript);
    }

    async deleteToken(userId){
        let sqlScript = `DELETE FROM tokens WHERE userId = ${userId}`
        await connection.query(sqlScript);
    }

    async getToken(userId, token){
        let sqlScript = `SELECT * FROM tokens WHERE token = '${token}' AND userId = ${userId}`;
        let product = await connection.query(sqlScript);
        return product[0];
    }

}

module.exports = new Token();