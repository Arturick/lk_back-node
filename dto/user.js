const mysql         = require('mysql2');
const connection    = mysql.createPool({
    host : "j45316134.myjino.ru",
    database : "j45316134",
    user : "j45316134",
    password : "cf}j}R75tRzM"
}).promise();

class User {
    async register(task1, name, phone){

    }

    async login(phone){

    }

    async getByTask1(task1){
        let sqlScript = `SELECT * FROM client_data WHERE task1 = ${task1}`;

        let answer = await connection.query(sqlScript);
        return answer[0];
    }
}

module.exports = new User();