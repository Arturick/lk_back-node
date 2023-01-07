const connection = require('../db-connection');

class Code {
    async setCode(phone, code){
        let sqlScript = `INSERT INTO code_access (phone, code) VALUES ('${phone}', '${code}')`;
        await connection.query(sqlScript);
    }

    async deleteCode(phone){
        let sqlScript = `DELETE FROM code_access WHERE phone = '${phone}'`;
        await connection.query(sqlScript);
    }

    async checkCode(phone, code){
        let sqlScript = `SELECT * FROM code_access WHERE phone = '${phone}' AND code = '${code}'`;
        let answer = await connection.query(sqlScript);
        return answer[0];
    }
}

module.exports = new Code();