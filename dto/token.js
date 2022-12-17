const mysql         = require('mysql2');
const connection    = mysql.createPool({
    host : "j45316134.myjino.ru",
    database : "j45316134",
    user : "j45316134",
    password : "cf}j}R75tRzM"
}).promise();

class Token {
    async saveToken(token, id){
        let sqlScript = `INSERT INTO tokens (id, token) VALUES(${id}, '${token}')`;

        await connection.query(sqlScript);
    }

    async deleteToken(token){
        let sqlScript = `DELETE FROM tokens WHERE token = '${token}'`
        await connection.query(sqlScript);
    }

    async getToken(token){
        let sqlScript = `SELECT * FROM tokens WHERE token = '${token}'`;

        let product = await connection.query(sqlScript);

        return product[0];
    }

}

module.exports = new Token();