const connection = require('../db-connection');
const buffer = require("buffer");
const {toBase64} = require("request/lib/helpers");

const reportTime = {

    1: 24,
    2: 168,
    3: 1950,
}

class Product {

    async setInterval(id, time){
        let sqlScript = `UPDATE client_temp SET interval_buy WHERE id = ${id}`
    }
    async getBuyout(task1, sort, group = false){
        let sqlScript = ``;
        let already = [];
        switch (sort) {
            case 1:
                sqlScript = group ? `SELECT *, COUNT(*) as plan, img_wb as image, article as art, grafik as date FROM client ct WHERE ct.group = '${group}' AND task1 = ${task1}  GROUP by article, \`size\`` : `SELECT *, COUNT(*) as plan, date_add as date, status FROM client ct WHERE  task1 = ${task1} GROUP by ct.group`;
                break;
            case 2:
                sqlScript = group ? `SELECT *, COUNT(*) as plan, img_wb as image, article as art, grafik as date FROM client ct WHERE ct.group = '${group}' AND task1 = ${task1} GROUP by grafik` : `SELECT *, COUNT(*) as plan, date_add as date, status FROM client ct WHERE  task1 = ${task1} GROUP by ct.group`;
                break;
            case 3:
                sqlScript = group ? `SELECT *,  img_wb as image, article as art, grafik as date FROM client ct WHERE ct.group = '${group}' AND task1 = ${task1}` : `SELECT *, COUNT(*) as plan, status FROM client ct WHERE  task1 = ${task1} GROUP by ct.group`;
                break;
        }
        let answer = await connection.query(sqlScript);
        let products = [];
        if(!group || sort != 3){
            if(sort != 3){
                if(answer[0].length > 0){
                    if(sort == 2){
                        sqlScript = sort == 1 ? `SELECT *, COUNT(*) as plan, img_wb as image, article as art, grafik as date FROM client_temp ct WHERE ct.group = ${group} AND task1 = ${task1}  GROUP by article, \`size\`` : `SELECT *, COUNT(*) as plan, img_wb as image, article as art, grafik as date FROM client_temp ct WHERE ct.group = ${group} AND task1 = ${task1} GROUP by grafik`;
                        let answerTemp = await connection.query(sqlScript);
                        for(let i of answerTemp[0]){
                            answer[0].push(i);
                        }
                    }

                    for(let i of answer[0]){
                        //i['date'] = i['date'].toLocaleString().replace('/', '-').replace('.', '-').replace('\\', '-').toLocaleString().replace('/', '-').replace('.', '-').replace('\\', '-').split(',')[0];
                        //i['grafik'] = i['grafik'] ? i['grafik'].toLocaleString().replace('/', '-').replace('.', '-').replace('\\', '-').toLocaleString().replace('/', '-').replace('.', '-').replace('\\', '-').split(',')[0] : i['grafik'];

                        let date = new Date(i['grafik']);
                        let dt = date.getDate()  < 10 ? `0${date.getDate()}`: date.getDate();
                        let mth = date.getMonth() + 1< 10 ? `0${date.getMonth() + 1}`: date.getMonth() + 1;
                        i['grafik'] = `${date.getFullYear()}-${mth}-${dt}`;
                        dt =   i['date'].getDate()  < 10 ? `0${i['date'].getDate()}`: i['date'].getDate();
                        mth = i['date'].getMonth() + 1< 10 ? `0${i['date'].getMonth() + 1}`: i['date'].getMonth() + 1;
                        i['date'] = `${i['date'].getFullYear()}-${mth}-${dt}`;
                        sqlScript = sort == 1 ? `SELECT *, COUNT(*) as cnt FROM client t WHERE t.group = ${i['group']} AND task1 = ${task1} AND status IN(2,3,4,5,6,7,8) AND article = ${i['art']}` : `SELECT COUNT(*) as cnt FROM client t WHERE t.group = ${i['group']} AND task1 = ${task1} AND status IN(2,3,4,5,6,7,8) AND grafik = '${i['grafik']}' `;
                        let product = await connection.query(sqlScript);
                        i['fact'] = product[0][0]['cnt'];
                        sqlScript = sort == 1 ? `SELECT *, COUNT(*) as cnt FROM client_temp t WHERE t.group = ${i['group']} AND task1 = ${task1} AND article = ${i['art']}` : `SELECT COUNT(*) as cnt FROM client_temp t WHERE t.group = ${i['group']} AND task1 = ${task1}  AND grafik = '${i['grafik']}'`;
                        product = await connection.query(sqlScript);
                        i['plan'] += +product[0][0]['cnt'];
                        i['ids'] = [];
                        sqlScript = sort == 1 ? `SELECT id as ids FROM client t WHERE t.group = ${i['group']} AND task1 = ${task1} AND status IN(2,3,4,5,6,7,8) AND article = ${i['art']}` : `SELECT id as ids FROM client t WHERE t.group = '${i['group']}' AND task1 = ${task1} AND grafik = '${i['grafik']}'`;
                        product = await connection.query(sqlScript);
                        console.log(i['grafik']);
                        for(let j of product[0]){
                            i['ids'].push(j['ids']);
                        }
                        sqlScript = sort == 1 ? `SELECT id as ids FROM client_temp t WHERE t.group = ${i['group']} AND task1 = ${task1} AND status IN(2,3,4,5,6,7,8) AND article = ${i['art']}` : `SELECT id as ids FROM client_temp t WHERE t.group = '${i['group']}' AND task1 = ${task1} AND grafik = '${i['grafik']}'`;
                        product = await connection.query(sqlScript);
                        for(let j of product[0]){
                            i['ids'].push(j['ids']);
                        }
                        products.push(i);
                    }

                } else {
                    sqlScript = sort == 1 ? `SELECT *, COUNT(*) as plan, img_wb as image, article as art, grafik as date FROM client_temp ct WHERE ct.group = ${group} AND task1 = ${task1}  GROUP by article, \`size\`` : `SELECT *, COUNT(*) as plan, img_wb as image, article as art, grafik as date FROM client_temp ct WHERE ct.group = ${group} AND task1 = ${task1} GROUP by grafik`;
                    answer = await connection.query(sqlScript);

                    for(let i of answer[0]){
                        sqlScript = sort == 1 ? `SELECT *, COUNT(*) as cnt FROM client t WHERE t.group = ${i['group']} AND task1 = ${task1} AND status IN(2,3,4,5,6,7,8) AND article = ${i['art']} AND \`size\` = '${i['size']}' ` : `SELECT COUNT(*) as cnt FROM client t WHERE t.group = ${i['group']} AND task1 = ${task1} AND status IN(2,3,4,5,6,7,8) AND grafik = '${i['grafik']}' `;
                        let product = await connection.query(sqlScript);
                        i['fact'] = product[0][0]['cnt'];
                        sqlScript = sort == 1 ? `SELECT *, COUNT(*) as cnt FROM client t WHERE t.group = ${i['group']} AND status IN(2,3,4,5,6,7,8) AND  task1 = ${task1} AND article = ${i['art']} AND \`size\` = '${i['size']}'` : `SELECT COUNT(*) as cnt FROM client t WHERE t.group = ${i['group']} AND task1 = ${task1}  AND grafik= '${i['grafik']}'`;
                        product = await connection.query(sqlScript);
                        i['plan'] += +product[0][0]['cnt'];
                        i['ids'] = [];
                        let dt =   i['date'].getDate()  < 10 ? `0${i['date'].getDate()}`: i['date'].getDate();
                        let mth = i['date'].getMonth() + 1< 10 ? `0${i['date'].getMonth() + 1}`: i['date'].getMonth() + 1;
                        i['date'] = `${i['date'].getFullYear()}-${mth}-${dt}`;sqlScript = sort == 1 ? `SELECT *, id as ids FROM client t WHERE t.group = ${i['group']} AND task1 = ${task1} AND status IN(2,3,4,5,6,7,8) AND  article = ${i['art']} AND \`size\` = '${i['size']}'` : `SELECT id as ids FROM client t WHERE t.group = ${i['group']} AND task1 = ${task1} AND grafik = '${i['grafik']}'`;
                        product = await connection.query(sqlScript);
                        console.log(sqlScript);
                        for(let j of product[0]){
                            i['ids'].push(j['ids']);
                        }
                        sqlScript = sort == 1 ? `SELECT *, id as ids FROM client_temp t WHERE t.group = ${i['group']} AND task1 = ${task1} AND article = ${i['art']} AND \`size\` = '${i['size']}'` : `SELECT id as ids FROM client_temp t WHERE t.group = ${i['group']} AND task1 = ${task1} AND grafik = '${i['grafik']}'`;
                        product = await connection.query(sqlScript);
                        for(let j of product[0]){
                            i['ids'].push(j['ids']);
                        }
                        products.push(i);
                    }
                }


            } else {
                console.log(answer[0]);
                for(let i of answer[0]){
                        if(already.indexOf(i['group']) != -1){continue}
                        already.push(i['group']);
                        let product = await connection.query(`SELECT *, COUNT(*) as cnt FROM client t WHERE t.group = ${i['group']} AND task1 = ${task1} AND status IN(2,3,4,5,6,7,8)`);
                        i['fact'] = product[0][0]['cnt'];
                        console.log(i);
                        if(!i['date_add']){
                            i['date_add'] = new Date();
                        }
                        let dt =   i['date_add'].getDate()  < 10 ? `0${i['date_add'].getDate()}`: i['date_add'].getDate();
                        let mth = i['date_add'].getMonth() + 1< 10 ? `0${i['date_add'].getMonth() + 1}`: i['date_add'].getMonth() + 1;
                        i['date'] = `${i['date_add'].getFullYear()}-${mth}-${dt}`;product = await connection.query(`SELECT *, COUNT(*) as cnt FROM client_temp t WHERE t.group = ${i['group']} AND task1 = ${task1}`);
                        i['plan'] += product[0][0]['cnt'];
                        products.push(i);
                    }
                answer = await connection.query(`SELECT *, COUNT(*) as plan, date_add as date, status FROM client_temp ct WHERE  task1 = ${task1} GROUP by ct.group`);

                for(let i of answer[0]){
                    if(already.indexOf(i['group']) != -1){
                        continue;
                        return;
                    }
                    console.log(i['group']);
                    if(already.indexOf(i['article']) != -1){continue;}
                    i['fact'] = 0;
                    let dt =   i['date'].getDate()  < 10 ? `0${i['date'].getDate()}`: i['date'].getDate();
                    let mth = i['date'].getMonth() + 1< 10 ? `0${i['date'].getMonth() + 1}`: i['date'].getMonth() + 1;
                    i['date'] = `${i['date'].getFullYear()}-${mth}-${dt}`;
                    products.push(i);
                }

            }

        } else {

            for(let i of answer[0]){
                if(i['sex'] == 'false' || i['sex'] == 'true'){
                    i['sex'] = i['sex'] == 'true' ? 'm' : 'ж';
                }
                products.push(i);
            }
            answer = await connection.query(`SELECT *,  img_wb as image, article as art, grafik as date FROM client_temp ct WHERE ct.group = '${group}' AND task1 = ${task1}`);
            for(let i of answer[0]){
                if(i['sex'] == 'false' || i['sex'] == 'true'){
                    i['sex'] = i['sex'] == 'true' ? 'm' : 'ж';
                }
                console.log(i['status'], 2);
                products.push(i);
            }
        }
        return products;
    }


    async getDelivery(task1, group = false){
        console.log(group)
        let sqlScript = group  ? `SELECT *, date_get as date, article as art, img_wb as image FROM client ct WHERE task1 = ${task1} AND date_buy = "${group}" AND status IN(2,3,4,5,6,7,8)` : `SELECT *, COUNT(*) as plan, date_buy as date FROM client ct WHERE task1 = ${task1} AND status IN(2,3,4,5,6,7,8) GROUP by date_buy`;

        let answer = await connection.query(sqlScript);
        if(!group){
            for(let i of answer[0]){
               i['fact'] = 0;
                let date = i['date'];
                let dt = date.getDate()  < 10 ? `0${date.getDate()}`: date.getDate();
                let mth = date.getMonth() + 1< 10 ? `0${date.getMonth() + 1}`: date.getMonth() + 1;
                i['date'] = `${date.getFullYear()}-${mth}-${dt}`;
                let product = await connection.query(`SELECT COUNT(*) as cnt FROM client ct WHERE task1 = ${task1} AND date_buy = '${i['date']}' AND status IN(4,5,6,7,8)`);

                i['fact'] = product[0][0]['cnt'];
                console.log(product[0]);
            }
        } else {
            for(let i of answer[0]){
                i['date'] = group;
                if(i['date_get']){
                   i['date_get'] = i['date_get']  ? i['date_get'].toLocaleString() : i['date_get'];
                }
            }
        }

        return answer[0];
    }

    async getReview(task1, group = false){
        console.log(task1);
        let sqlScript = group ? `SELECT *, date_otziv as date, img_wb as image, article AS art, photo as photos, text_otziv AS review, rating_otziv AS rating FROM client ct WHERE task1 = ${task1} AND article = ${group} AND status IN(4,5,6,7,8 )` : `SELECT *, COUNT(*) as plan, article as art, img_wb as image FROM client WHERE task1 = ${task1}  AND status IN(4,5,6,7,8) GROUP BY article`;
        console.log(sqlScript);
        let answer = await connection.query(sqlScript);
        console.log(answer[0]);
        if(!group){
            for(let i of answer[0]){
                let product = await connection.query(`SELECT COUNT(*) as cnt FROM client WHERE task1 = ${task1} AND article = ${i['art']} AND status IN(5,6,7,8 )`);
                i['fact'] = product[0][0]['cnt']
            }
        } else {
            for(let i of answer[0]){
                if(i['photos']){
                    i['photos'] = i['photos'].split(',');
                } else {
                    i['photos'] = [];
                }
                i['review_editable'] = false
                console.log(i['review']);
                const buff = Buffer.from(i['review'] ? i['review'] : '', 'base64');
                const str = buff.toString('utf-8');
                i['review'] = str;
            }
        }

        return answer[0];
    }

    async getDraft(task1, group = false){
        let sqlScript = group ? `SELECT *, COUNT(*) as count, article as art, search_key as query FROM client_draft ct WHERE task1 = ${task1} AND ct.group = ${group} GROUP by article, search_key` : `SELECT *, date_add as date, COUNT(*) as plan FROM client_draft ct WHERE task1 = ${task1} GROUP by ct.group`;
        let answer = await connection.query(sqlScript);
        if(group){
            for(let i of answer[0]){
                sqlScript = `SELECT *, COUNT(*) as rcount FROM client_draft ct WHERE task1 = ${task1} AND ct.group = ${group} AND article = '${i['art']}' AND search_key = '${i['query']}' AND ct.type = 'отзывв'`;
                let answer2 = await connection.query(sqlScript);
                i['rcount'] = answer2[0][0]['rcount'];
            }
        }
        return answer[0];
    }


    async updateDraft(task1, group, products){
        let sqlScript = `DELETE FROM client_draft WHERE \`group\` = '${group}'`;
        await connection.query(sqlScript);
        for(let i of products){
            sqlScript  =  `INSERT INTO client_draft (status, mp, type, article, size, search_key, barcode, kto_zabirat, brand, naming, task1, date_add, \`group\`, img_wb, price_wb)
VALUES ('черновик', 'wb', '${i['type']}', '${i['article']}', '${i['size']}', '${i['search_key']}', '${i['barcode']}', 'RATE-THIS', '${i['brand']}', '${i['naming']}', '${task1}', '${i['date_add']}', ${group}, '${i['image']}', ${i['price']})`;
            console.log(sqlScript);
            await connection.query(sqlScript);
        }
    }

    async deleteProduct(task1, id){
        console.log(task1, id);
        let sqlScript = `DELETE FROM client_temp WHERE  id = ${id}`;
        await connection.query(sqlScript);
    }

    async setReview(task1, product){
        let text = toBase64(product['review']);
        console.log(text);
        let sqlScript = `UPDATE client SET screen_otziv = '${product['photos']}', text_otziv = '${text}', rating_otziv = '${product['rating']}', status = 5 WHERE task1 = ${task1} AND id = ${product['id']}`;
        await connection.query(sqlScript);
    }

    async save(task1, products, profile, group){
        let sqlScript = ``;
        for(let i of products){
            let date = new Date(i['grafik']);
            let dt = date.getDate()  < 10 ? `0${date.getDate()}`: date.getDate();
            let mth = date.getMonth() + 1< 10 ? `0${date.getMonth() + 1}`: date.getMonth() + 1;
            date = `${date.getFullYear()}-${mth}-${dt}`;
            i['date_add'] = new Date(i['date_add']);
            let dt2 = i['date_add'].getDate()  < 10 ? `0${i['date_add'].getDate()}`: i['date_add'].getDate();
            let mth2 = i['date_add'].getMonth() + 1< 10 ? `0${i['date_add'].getMonth() + 1}`: i['date_add'].getMonth() + 1;
            i['date_add'] = `${i['date_add'].getFullYear()}-${mth2}-${dt2}`;

            sqlScript  =  `INSERT INTO client_temp (status, grafik, mp, type, article, size, search_key, barcode, kto_zabirat, brand, naming, task1, date_add, \`group\`, img_wb, price_wb, sex)
VALUES ('Заявка', "${date}", 'wb', '${i['type']}', '${i['article']}', '${i['size']}', '${i['search_key']}', '${i['barcode']}', 'RATE-THIS', '${i['brand']}', '${i['naming']}', '${task1}', '${i['date_add']}', ${group}, '${i['image']}', ${i['price']}, '${i['gender']}')`;
            console.log(sqlScript);
            await connection.query(sqlScript);
        }


    }


    async draftSave(task1, products, profile, group){
        let sqlScript = ``;
        for(let i of products){
            sqlScript  =  `INSERT INTO client_draft (status, mp, type, article, size, search_key, barcode, kto_zabirat, brand, naming, task1, date_add, \`group\`, img_wb, price_wb)
VALUES ('черновик', 'wb', '${i['type']}', '${i['article']}', '${i['size']}', '${i['search_key']}', '${i['barcode']}', 'RATE-THIS', '${i['brand']}', '${i['naming']}', '${task1}', '${i['date_add']}', ${group}, '${i['image']}', ${i['price']})`;
            console.log(sqlScript);
            await connection.query(sqlScript);
        }


    }

    async updateDB(){
        let date = new Date();
        let dt = date.getDate()  < 10 ? `0${date.getDate()}`: date.getDate();
        let mth = date.getMonth() + 1< 10 ? `0${date.getMonth() + 1}`: date.getMonth() + 1;
        date = `${date.getFullYear()}-${mth}-${dt}`;
        console.log(date);
        let sqlScript = `SELECT * FROM client_temp WHERE grafik = '${date}'`;
        let answer = await connection.query(sqlScript);
        console.log(answer[0].length);

        for(let i of answer[0]){
            console.log(i);
            sqlScript = `INSERT INTO client (task1, grafik, mp, type, article, size, search_key, barcode, sex, kto_zabirat, brand, naming, price_wb, date_add, \`group\`, img_wb) 
VALUES (${i['task1']}, '${i['grafik']}', 'wb', '${i['type']}', ${i['article']}, ${i['size']}, '${i['search_key']}', '${i['barcode']}', '${i['sex']}', '${i['kto_zabirat']}', '${i['brand']}', '${i['naming']}', ${i['price_wb']}, NOW(), '${i['group']}', '${i['img_wb']}')`;
            console.log(sqlScript);
            await connection.query(sqlScript);
        }
        sqlScript = `DELETE FROM client_temp WHERE grafik = '${date}'`;
        await connection.query(sqlScript);
        console.log(answer[0]);
    }

    async getGraph(task1, type = false){
        let sqlScript = type ? `SELECT COUNT(*) as cnt, date_buy, price FROM client WHERE task1 = ${task1} AND status IN(2,3,4,5,6,7,8) AND date_buy  > DATE_SUB(NOW(), INTERVAL 168 HOUR)  GROUP by date_buy` : `SELECT COUNT(*) as cnt, date_buy, price FROM client WHERE task1 = ${task1} AND status IN(2,3,4,5,6,7,8)  AND date_buy  < DATE_SUB(NOW(), INTERVAL 168 HOUR) AND date_buy  > DATE_SUB(NOW(), INTERVAL 336 HOUR) GROUP by date_buy`;
        let answer = await connection.query(sqlScript);

        return answer[0];
    }

    async reportBuyout(task1, type, dates = []){
        let sqlScript = ``;

        switch (type) {
            case 1:
                sqlScript = `SELECT *, COUNT(*) as cnt FROM client WHERE task1 = ${task1} AND status IN(2,3,4,5,6,7,8) AND mp = 'wb' GROUP BY article, date_buy, price, \`group\``;
                break;
            case 2:
                sqlScript = `SELECT *, COUNT(*) as cnt FROM client WHERE task1 = ${task1} AND status IN(2,3,4,5,6,7,8) AND date_buy > DATE_SUB(NOW(), INTERVAL 168 HOUR) AND mp = 'wb'  GROUP BY article,date_buy, price, \`group\``;
                break;
            case 3:
                sqlScript = `SELECT *, COUNT(*) as cnt FROM client WHERE task1 = ${task1} AND status IN(2,3,4,5,6,7,8) AND date_buy = CURDATE()  AND mp = 'wb' GROUP BY article,date_buy, \`group\`, price`;
                break;
            case 4:
                sqlScript = `SELECT *, COUNT(*) as cnt FROM client WHERE task1 = ${task1} AND status IN(2,3,4,5,6,7,8) AND date_buy > DATE_SUB(NOW(), INTERVAL 744 HOUR)  AND mp = 'wb' GROUP BY article,date_buy, price, \`group\``;

                break;
            case 5:
                sqlScript = `SELECT *, COUNT(*) as cnt FROM client WHERE task1 = ${task1} AND status IN(2,3,4,5,6,7,8) AND date_buy > '${dates[0]}' AND date_buy < '${dates[1]}'  AND mp = 'wb'   GROUP BY article,date_buy, price, \`group\``;
                break;
        }
        let answer = await connection.query(sqlScript);

        return answer[0];
    }

    async getBuyoutReport(task1, type, dates){
        let sqlScript = ``;
        if(type < 4){
            sqlScript = `SELECT *, COUNT(*) as cnt, SUM(price) as totalSum FROM client WHERE  task1 = ${task1} AND status IN(2,3,4,5,6,7,8) AND date_buy  > DATE_SUB(NOW(), INTERVAL ${reportTime[type]} HOUR) GROUP by article, \`group\`, price`;
        } else {
            sqlScript = `SELECT *, COUNT(*) as cnt, SUM(price) as totalSum FROM client WHERE  task1 = ${task1} AND status IN(2,3,4,5,6,7,8)  GROUP by article, \`group\`, price`;
        }
        if(dates.length > 0){
            sqlScript = `SELECT *, COUNT(*) as cnt, SUM(price) as totalSum FROM client WHERE  task1 = ${task1} AND status IN(2,3,4,5,6,7,8) AND date_buy > '${dates[0]}' AND date_buy < '${dates[1]}'  GROUP by article, \`group\`, price`;
        }
        let answer = await connection.query(sqlScript);

        return answer[0];
    }

    async getDeliveryReport(task1, type, dates){
        let sqlScript = ``;
        if(type < 4){
            sqlScript = `SELECT *, COUNT(*) as cnt, SUM(price) as totalSum FROM client WHERE  task1 = ${task1} AND status IN(3,4,5,6,7,8) AND date_buy  > DATE_SUB(NOW(), INTERVAL ${reportTime[type]} HOUR) GROUP by article, \`group\`, price`;
        } else {
            sqlScript = `SELECT *, COUNT(*) as cnt, SUM(price) as totalSum FROM client WHERE  task1 = ${task1} AND status IN(3,4,5,6,7,8)  GROUP by article, \`group\`, price`;
        }
        if(dates.length > 0){
            sqlScript = `SELECT *, COUNT(*) as cnt, SUM(price) as totalSum FROM client WHERE  task1 = ${task1} AND status IN(3,4,5,6,7,8) AND date_buy > '${dates[0]}' AND date_buy < '${dates[1]}'  GROUP by article, \`group\`, price`;
        }

        let answer = await connection.query(sqlScript);
        for(let i of answer[0]){
            sqlScript = `SELECT COUNT(*) as cnt FROM client WHERE task1 = ${task1} AND \`group\` = '${i['group']}' AND article = ${i['article']} AND price =' ${i['price']}' AND status IN(4,5,6,7,8)`;
            let product = await connection.query(sqlScript);
            i['fact'] = product[0][0]['cnt'];
        }
        return answer[0];
    }

    async getReviewReport(task1, type, dates){
        let sqlScript = ``;
        if(type < 4){
            sqlScript = `SELECT *, COUNT(*) as cnt, SUM(price) as totalSum FROM client WHERE  task1 = ${task1} AND status IN(4,5,6,7,8) AND date_buy  > DATE_SUB(NOW(), INTERVAL ${reportTime[type]} HOUR) AND \`type\` = 'отзыв' GROUP by article, \`group\`, price`;
        } else {
            sqlScript = `SELECT *, COUNT(*) as cnt, SUM(price) as totalSum FROM client WHERE  task1 = ${task1} AND status IN(4,5,6,7,8)  AND \`type\` = 'отзыв'  GROUP by article, \`group\`, price`;
        }
        if(dates.length > 0){
            sqlScript = `SELECT *, COUNT(*) as cnt, SUM(price) as totalSum FROM client WHERE  task1 = ${task1} AND status IN(4,5,6,7,8) AND date_buy > '${dates[0]}' AND date_buy < '${dates[1]}'  GROUP by article, \`group\`, price`;
        }
        let answer = await connection.query(sqlScript);
        return answer[0];
    }

    async setReport(task1, naming, type, link){
        let sqlScript = `INSERT INTO reports_list (task1, naming, type, date_reports, link) VALUES (${task1}, "${naming}", '${type}', NOW(), '${link}')`
        await connection.query(sqlScript);

    }

    async getReport(task1, type){
        let sqlScript = `SELECT * FROM reports_list WHERE task1 = ${task1} AND naming = '${type}'`;

        let answer = await connection.query(sqlScript);
        return answer[0];
    }
}

module.exports = new Product();