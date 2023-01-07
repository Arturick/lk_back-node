const connection = require('../db-connection');

class spam {
    async addSpam(login){
        let sqlScript = `INSERT INTO password_spam (login) VALUES ('${login}')`

        await connection.query(sqlScript);
    }

    async getSpam(login){
        let sqlScript = `SELECT * FROM password_spam WHERE login = '${login}'`;

        let answer = await connection.query(sqlScript);

        return answer[0];
    }

    async deleteOldReq(){
        let sqlScript = `DELETE FROM spam_log WHERE \`date\` < DATE_SUB(NOW(), INTERVAL 1 HOUR)`;

        await connection.query(sqlScript);
    }

    async getReqByIp(ip){
        let sqlScript = `SELECT * FROM spam_log WHERE ip = '${ip}' AND \`date\` > DATE_SUB(NOW(), INTERVAL 1 HOUR)`;
        let answer =  await connection.query(sqlScript);

        return answer[0];
    }

    async addReq(ip){
        let sqlScript = `INSERT INTO spam_log (ip, date) VALUES('${ip}', NOW())`;
        await connection.query(sqlScript);
    }
}

module.exports = new spam();