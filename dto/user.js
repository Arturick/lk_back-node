const mysql         = require('mysql2');
const connection    = mysql.createPool({
    host : "j45316134.myjino.ru",
    database : "j45316134",
    user : "j45316134",
    password : "cf}j}R75tRzM"
}).promise();

class User {
    async register(phone, name, surname, task1, pass = false){

        let sqlScript = pass ? `INSERT INTO client_data (task1, phone, login, password, u_name, u_surname) VALUES (${task1}, '${phone}', '${phone}', '${pass}', '${name}', '${surname}')` : `INSERT INTO client_data (task1, phone) VALUES (${task1}, '${phone}')`;

        await connection.query(sqlScript);
    }

    async login(login, password){
        let sqlScript = `SELECT * FROM client_data WHERE login = ${login} AND password = '${password}'`;

        let product = await connection.query(sqlScript);
        return product[0];
    }

    async getByPhone(phone){
        let sqlScript = `SELECT * FROM client_data WHERE phone = ${phone}`;

        let product = await connection.query(sqlScript);
        return product[0];
    }

    async getById(id){
        let sqlScript = `SELECT * FROM client_data WHERE id = ${id}`;

        let product = await connection.query(sqlScript);
        return product[0][0];
    }

    async getByTask1(task1){
        let sqlScript = `SELECT * FROM client_data WHERE task1 = ${task1}`;

        let answer = await connection.query(sqlScript);
        return answer[0];
    }

    async updateProfile(profile){
        let sqlScript = `UPDATE client_data SET wb_api_key = '${profile['wb_api_key']}', u_name = '${profile['u_name']}', u_surname = '${profile['u_surname']}' WHERE id = ${profile['id']}`;
        await connection.query(sqlScript);

    }

    async resetPassword(name, surname, phone, task1, pass){
        let sqlScript = `UPDATE client_data SET password = '${pass}' WHERE u_name = '${name}' AND u_surname = '${surname}' AND phone = '${phone}' AND task1 = ${task1}`;

        await connection.query(sqlScript);
    }

    async getUser(name, surname, phone, task1){
        let sqlScript = `SELECT * FROM client_data WHERE  phone = '${phone}' OR task1 = ${task1}`;
        let answer = await connection.query(sqlScript);
        return answer[0];
    }

    async getManagerLink(link){
        let sqlScript = `SELECT * FROM manager_access WHERE  link = '${link}'`;
        let answer = await connection.query(sqlScript);
        return answer[0];
    }

    async addManagerLink(userId, code, login, name, surname){
        let sqlScript = `INSERT INTO manager_access (userId, link, userLogin, name, surname) VALUES ('${userId}', '${code}', '${login}', '${name}', '${surname}')`;
        await connection.query(sqlScript);
    }

    async addManager(phone, name, surname, task1, pass, role, userId){
        let sqlScript = `INSERT INTO client_data (task1, phone, login, password, u_name, u_surname, parent, role) VALUES (${task1}, '${phone}', '${phone}', '${pass}', '${name}', '${surname}', '${userId}', '${role}')`;

        await connection.query(sqlScript);
    }
}

module.exports = new User();