const mysql         = require('mysql2');
const connection    = mysql.createPool({
    host : "j45316134.myjino.ru",
    database : "j45316134",
    user : "j45316134",
    password : "cf}j}R75tRzM"
}).promise();

class Code {
    async setCode(phone, code){
        let sqlScript = `INSERT INTO code_access (phone, code) VALUES ('${phone}', '${code}')`;
        await connection.query(sqlScript);
    }

    async checkCode(phone, code){
        let sqlScript = `SELECT * FROM code_access WHERE phone = '${phone}' AND code = '${code}'`;
        let product = await connection.query(sqlScript);
        return product[0][product[0].length - 1];
    }
}

module.exports = new Code();