const axios = require('axios');
const productDTO = require('../dto/product');
const userDTO = require('../dto/user');
const productService = require('../service/Product');
const xlsxFile = require('read-excel-file/node');
const ApiError = require('../exeption/error');
var fs = require('fs');
const errorText = require('../data/error-text');
const xl = require('excel4node');
const wb = new xl.Workbook();
require('dotenv').config()

let TitleStyle = wb.createStyle({
    alignment: {
        wrapText: true,
    },

    font: {
        bold: true,
        color: '46bdc6',
        name: 'Montserrat',
        size: 24,
        b: true
    },
});
let description = wb.createStyle({
    alignment: {
        wrapText: true,
    },

    font: {
        bold: true,
        name: 'Montserrat',
        size: 14,
        b: true
    },
});

class product {
    async #getUser(id){
        let user = {};
        user = await  userDTO.getById(id);
        if(user.length < 1){
            console.log('user not find');
        }

        return user[0];
    }

    async findByArticle(article){
        if(!article){
            throw ApiError.BadRequest(errorText.noData);
        }
        let products =  await productService.findProductByArt(article);
        console.log(products);
        let headers = await productService.getHeader('newRequest', 1);

        return {headers: headers, products: products};
    }

    async findPosition(products){
        if(!product){
            throw ApiError.BadRequest(errorText.noData);
        }

        let answer = [];
        for(let j of products){
            let position = -1,
                isPosition = false,
                needProduct = j,
                query = j['query'];
            console.log(j);
            for(let i = 1; i<65; i++){
                await axios.get(`https://search.wb.ru/exactmatch/ru/common/v4/search?appType=1&couponsGeo=12,3,18,15,21&curr=rub&dest=-1029256,-102269,-2162196,-1257786&emp=0&lang=ru&locale=ru&page=${i}&pricemarginCoeff=1.0&query=${query}&reg=0&regions=68,64,83,4,38,80,33,70,82,86,75,30,69,22,66,31,40,1,48,71&resultset=catalog&sort=popular&spp=0&suppressSpellcheck=false`)
                    .then(answer => {

                        if(!answer['data'] || !answer['data']['data'] ){return}
                        answer['data']['data']['products'].map((product, index) => {

                            if(product['id'] == needProduct['article']){
                                console.log(i*1000)
                                isPosition = true;
                                position = (i * 100) + (index);
                            }
                        })
                    })
                    .then(error => {

                    })
                if(isPosition){
                    break;
                }
            }

            answer.push({position: position, art: needProduct['article'], 'query': query, index:  answer.length});

        }

        return answer;


    }

    async findByArticles(articles){
        if(!articles){
            throw ApiError.BadRequest(errorText.noData);
        }
        let products = [];
        let article = articles.split(/\n| |,|\//);
        for(let i of article){
            console.log(i);
            let product = await productService.findProductByArt(i);
            if(!product){
                continue;
            }
            products.push(product);
        }
        let headers = await productService.getHeader('newRequest', 1);

        return {headers: headers, products: products};
    }

    async getBuyout(user, sort, group){
        if(!sort){
            throw ApiError.BadRequest(errorText.noData);
        }

        let products = await productDTO.getBuyout(user['task1'], sort, group);
        products = await productService.setStatusProduct(products, 'buyout', sort, group);
        let headers = await productService.getHeader('buyout', sort, group);

        return {headers: headers, products: products};
    }

    async getDelivery(user, date_get){

        let products = await productDTO.getDelivery(user['task1'], date_get);
        products = await productService.setStatusProduct(products, 'delivery', 1, date_get);

        let headers = await productService.getHeader('delivery', 1, date_get);

        return {headers: headers, products: products};
    }

    async getDelete(user, id){
        await productDTO.deleteProduct(user['task1'], id);
        return {};
    }

    async getReview(user, article){
        let products = await productDTO.getReview(user['task1'], article);
        products = await productService.setStatusProduct(products, 'review', 1, article);
        let headers = await productService.getHeader('review', 1, article);

        return {headers: headers, products: products};
    }

    async getProductByApi(user){

        let token = user['wb_api_key'];

        let products = await productService.getProductsByApi(token);

        for(let i of products){
            console.log(i['nmId'])

            i['image'] = `https://images.wbstatic.net/c246x328/new/${Math.floor(+i['nmId']/10000)}0000/${String(+i['nmId'])}-1.jpg`

            let sizes = [];
            if(i['sizes']){
                for(let j of i['sizes']){
                    sizes.push(i['origName']);
                }
            }
            i['sizes'] = sizes ;
            i['art'] = i['nmId'];
            i['barcode'] = i['barcode'];
        };
        let header = await productService.getHeader('apiProduct', 1);

        return {headers: header, products: products}
    }

    async parseExcel(){

        let data = [],
            articles = [];
        data = await xlsxFile(`${process.cwd()}/articles.xlsx`).then((rows) => {
            return rows;
        });
        console.log(data[0]);
        for(let i = 3; i < data.length; i++){
            let row = data[i];
            articles.push({});
            articles[articles.length - 1]['art'] = row[0];
            articles[articles.length - 1]['barcode'] = row[1];
            articles[articles.length - 1]['query'] = row[2];
            articles[articles.length - 1]['count'] = row[3];
            articles[articles.length - 1]['rcount'] = row[4];
        }
        fs.unlinkSync(`${process.cwd()}/articles.xlsx`);
        return articles;
    }

    async getDraft(user, group = false){

        console.log(group);
        let products = await productDTO.getDraft(user['task1'], group);
        products = await productService.setStatusProduct(products, 'buyout', 3, group);

        let headers = []
        if(group){
            headers = await productService.getHeader('newRequest', 3, group);
        } else {
            headers = await productService.getHeader('buyout', 3, group);
        }
        return {headers: headers, products: products};
    }

    async updateDraft(user, group, items){
        if( !group || !items){
            throw ApiError.BadRequest(errorText.noData);
        }
        console.log(group);
        let products = [];
        for(let i of items){

            let commentCount = 0;
            for(let j = 0; j < i.count; j++){
                console.log(1);
                products.push({});
                products[products.length - 1]['article'] = i['article'];
                products[products.length - 1]['price'] = i['price'];
                products[products.length - 1]['barcode'] = i['barcode'];
                products[products.length - 1]['brand'] = i['brand'];
                products[products.length - 1]['date_add'] = i['date_add'];
                products[products.length - 1]['grafik'] = i['date'];
                products[products.length - 1]['size'] = i['size'];
                products[products.length - 1]['gender'] = i['gender'];
                products[products.length - 1]['image'] = i['image'];
                products[products.length - 1]['naming'] = i['naming'];
                products[products.length - 1]['search_key'] = i['query'];
                if(commentCount < i.rcount){
                    commentCount +=1;
                    products[products.length - 1]['type'] = 'отзыв';
                } else {
                    products[products.length - 1]['type'] = 'выкуп';
                }

            }
        }
        await productDTO.updateDraft(user['task1'], group, products);

        return {};
    }

    async save(user, items){
        if(!items){
            throw ApiError.BadRequest(errorText.noData);
        }
        let products = [];
        for(let i of items){
``
            let commentCount = 0;
            for(let j = 0; j < i.count; j++){
                products.push({});
                products[products.length - 1]['article'] = i['article'];
                products[products.length - 1]['price'] = i['price'];
                products[products.length - 1]['barcode'] = i['barcode'];
                products[products.length - 1]['brand'] = i['brand'];
                products[products.length - 1]['date_add'] = i['date_add'];
                products[products.length - 1]['grafik'] = i['date'];
                products[products.length - 1]['size'] = i['size'];
                products[products.length - 1]['gender'] = i['gender'] == 'm'  && i['gender'].length > 0 ? true : false;
                products[products.length - 1]['image'] = i['image'];
                products[products.length - 1]['naming'] = i['naming'];
                products[products.length - 1]['search_key'] = i['query'];
                if(commentCount < i.rcount){
                    commentCount +=1;
                    products[products.length - 1]['type'] = 'отзыв';
                } else {
                    products[products.length - 1]['type'] = 'выкуп';
                }

            }
        }
        let group = new Date().getTime();
        await productDTO.save(user['task1'], products, user, group);
        return {}
    }

    async saveDraft(user, items){
        if(!items){
            throw ApiError.BadRequest(errorText.noData);
        }
        let products = [];
        for(let i of items){

            let commentCount = 0;
            for(let j = 0; j < i.count; j++){
                console.log(1);
                products.push({});
                products[products.length - 1]['article'] = i['article'];
                products[products.length - 1]['price'] = i['price'];
                products[products.length - 1]['barcode'] = i['barcode'];
                products[products.length - 1]['brand'] = i['brand'];
                products[products.length - 1]['date_add'] = i['date_add'];
                products[products.length - 1]['grafik'] = i['date'];
                products[products.length - 1]['size'] = i['size'];
                products[products.length - 1]['gender'] = i['gender'];
                products[products.length - 1]['image'] = i['image'];
                products[products.length - 1]['naming'] = i['naming'];
                products[products.length - 1]['search_key'] = i['query'];
                if(commentCount < i[['rcount']]){
                    commentCount +=1;
                    products[products.length - 1]['type'] = 'отзыв';
                } else {
                    products[products.length - 1]['type'] = 'выкуп';
                }

            }
        }
        let group = new Date().getTime();
        await productDTO.draftSave(user['task1'], products, user, group);
        return {}
    }

    async saveReview(user, item){
        if(!item){
            throw ApiError.BadRequest(errorText.noData);
        }

        await productDTO.setReview(user['task1'], item);

        return {};
    }

    async getGraph(user){
        console.log(user);
        let seller1 = await productDTO.getGraph(user['task1'], false);
        let seller2 = await productDTO.getGraph(user['task1'], true);
        let last = [0,0,0,0,0,0,0];
        let current = [0,0,0,0,0,0,0];
        let cnt = 0,
            totalSum = 0;
        let dates = [];
        console.log(seller2)
        for(let i of seller1){
            cnt+= +i['cnt'];
            totalSum = +i['cnt'] * i['price'];
            last[i['date_buy'].getDay()] = i['cnt'];
            //date_buy
        }
        for(let i of seller2){
            cnt+= +i['cnt'];
            totalSum = +i['cnt'] * i['price'];
            current[i['date_buy'].getDay()] = i['cnt'];
        }

        return {
            'last' : last,
            'current' : current,
            'count' : cnt,
            'sum' : totalSum,
            'update_date' : new Date().toLocaleDateString().replace('/', '-').replace('/', '-').replace('\\', '-').replace('\\', '-').replace('.', '-').replace('.', '-').split(',')[0],
            'update_time' : new Date().toLocaleDateString().replace('/', '-').replace('/', '-').replace('\\', '-').replace('\\', '-').replace('.', '-').replace('.', '-').split(',')[0],
    };
    }

    async sortBuyByDate(items, dates){
        if(!items || !dates){
            throw ApiError.BadRequest(errorText.noData);
        }
        let buyCounts = {};
        let countDate = 0;
        if(dates.length < 2){
            countDate = 1;
        } else {
            countDate = (new Date(dates[dates.length - 1]) - new Date(dates[0])) / (1000 * 60 * 60 * 24);
        }
        let arts = [];
        console.log(dates);
        for(let i of items){
            let productCount = i['count'];
            if(!buyCounts[i['article']]){
                buyCounts[i['article']] = {};
            }
            while(1 < 2){
                if(productCount <= 0){
                    break;
                }
                for(let j = 0; j < countDate; j++){
                    let dt = new Date(new Date(dates[0]).getTime() + (86400000 * j));
                    dt = `${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()}`;
                    console.log(dt);
                    if(!buyCounts[i['article']][dt]){
                        buyCounts[i['article']][dt] = {count: 0, rcount: 0};
                    }
                    productCount--;
                    buyCounts[i['article']][dt].count++;
                    if(productCount <= 0){
                        break;
                    }

                }
            }
        }
        for(let i of items){
            let productCount = i['rcount'];
            if(!buyCounts[i['article']]){
                buyCounts[i['article']] = {};
            }
            while(1 < 2){
                if(productCount <= 0){
                    break;
                }
                for(let j = 0; j < countDate; j++){
                    let dt = new Date(new Date(dates[0]).getTime() + (86400000 * j));
                    dt = `${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()}`;
                    console.log(dt);
                    if(!buyCounts[i['article']][dt]){
                        buyCounts[i['article']][dt] = {count: 0, rcount: 0};
                    }
                    if(productCount <= 0){
                        break;
                    }
                    productCount--;
                    buyCounts[i['article']][dt].rcount++;

                }
            }
        }
        console.log(buyCounts);
        let answer = {items: []};
        for(let i of items){
            arts.push(i['article']);
            let art = i['article'];
            for(let j in buyCounts[art]){
                i['date'] = j;
                i['count'] = buyCounts[art][j].count;
                i['rcount'] = buyCounts[art][j].rcount;
                answer.items.push({});
                Object.assign(answer.items[answer.items.length - 1], i);
            }

        }
        let headers = await productService.getHeader('oldRequest', 1);
        return {
            'days': countDate,
            'items': answer.items,
            'headers': headers,
            'arts': arts
        };
    }
//    async saveDraft()

    async reportBuyout(user, type, dates){
        if(!type){
            console.log('403');
        }
        let title = {
            1: 'за все время',
            2: 'за неделю',
            3: 'за сегодняшний день',
            4: 'за месяц',
            5: dates.length > 0?`c ${dates[0].toLocaleDateString().split(',')[0]} по ${dates[1].toLocaleDateString().split(',')[0]}}` : '',
        }
        let ws = wb.addWorksheet('Sheet 1');
        ws.cell(1, 1, 1, 4, true).string('RATE THIS\nPROMOTION').style(TitleStyle);
        ws.row(1).setHeight(105);
        ws.cell(1, 5, 1, 8, true).string('ЛЛучший сервис по работе с маркетплейсами!\nТелефон для связи +7 (995) 921-12-10\nСайт : https://rate-this.ru/\nНаш телеграмм: https://t.me/ratethisgroup').style(description);
        ws.cell(2, 1, 2, 8, true).string(`Отчет по выкупам по выкупам: ${title[type]}`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 1).string(`Артикул`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 2).string(`Дата покупки`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 3).string(`БарКод`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 4).string(`Бренд`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 5).string(`Наименование`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 6).string(`Колличество`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 7).string(`цена`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 8).string(`сумма`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        let products = await productDTO.reportBuyout(task1, type, dates);
        let count = 0,
            totalSum = 0;
        for(let i = 0; i<products.length; i++){
            let product = products[i];
            console.log(product['date_buy'].toLocaleString().split(',')[0]);
            ws.cell(i+4, 1).string(`${product['article']}`);
            ws.cell(i+4, 2).string(`${product['date_buy'].toLocaleString().split(',')[0]}`);
            ws.cell(i+4, 3).string(`${product['barcode']}`);
            ws.cell(i+4, 4).string(`${product['brand']}`);
            ws.cell(i+4, 5).string(`${product['naming']}`);
            ws.cell(i+4, 6).string(`${product['cnt']}`);
            ws.cell(i+4, 7).string(`${product['price']}`);
            ws.cell(i+4, 8).string(`${+product['cnt'] * +product['price']}`);
            count+=+product['cnt'];
            totalSum+=+product['cnt'] * (+product['price']);
        }
        ws.cell(products.length+4, 5).string(`Кол-во`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(products.length+4, 6).string(`${count}`)
        ws.cell(products.length+4, 7).string(`Сумма`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(products.length+4, 8).string(`${totalSum}`)


        wb.write(`Отчет по выкупам за ${title[type]} ${Math.random()}.xlsx`);
        return {};
    }

    async buyoutReport(user, type, dates = []){
        let reportType = {
            1: 'За сегодня',
            2: 'Неделю',
            3: 'Месяц',
            4: 'Все время',
            5: dates.length > 0 ? `c ${dates[0]} по ${dates[1]}` : ``,
        }
        console.log(type);
        let products = await productDTO.getBuyoutReport(user['task1'], type, dates);
        let ws = wb.addWorksheet('Sheet 1');

        ws.cell(1, 1, 1, 4, true).string('RATE THIS\nPROMOTION').style(TitleStyle);
        ws.row(1).setHeight(105);
        ws.cell(1, 5, 1, 8, true).string('Лучший сервис по работе с маркетплейсами!\nТелефон для связи +7 (499) 133-39-37\nСайт : https://rate-this.ru/').style(description);
        ws.cell(2, 1, 2, 8, true).string(`Отчет по выкупам за ${reportType[type]}`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 1).string(`Артикул`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 2).string(`Дата покупки`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 3).string(`Статус`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 4).string(`Цена`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 5).string(`БарКод`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 6).string(`Наименование`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 7).string(`Колличество`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 8).string(`Бренд`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));

        let allCount = 0;
        let allPrice = 0;
        for(let i =0; i < products.length; i++){
            let product = products[i];
            ws.cell(i+4, 1).string(String(product['article']))
            ws.cell(i+4, 2).string(String(product['date_get'].toLocaleString()))
            ws.cell(i+4, 3).string(`оплачено`)
            ws.cell(i+4, 4).string(String(product['price']))
            ws.cell(i+4, 5).string(String(product['barcode']))
            ws.cell(i+4, 6).string(String(product['naming']))
            ws.cell(i+4, 7).string(String(product['cnt']))
            ws.cell(i+4, 8).string(String(product['brand']))
            allPrice += product['totalSum'];
            allCount += product['cnt'];
        }
        ws.cell(products.length + 4, 5).string(`Общее колличество`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(products.length + 4, 6).string(String(allCount));
        ws.cell(products.length + 4, 7).string(`Общая цена`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(products.length + 4, 8).string(String(allPrice));
        wb.write(process.env.URL_REPORT);
        await productDTO.setReport(user['task1'], 'buyout', reportType[type]);
        return {};

    }

    async deliveryReport(user, type, dates= []){

        let reportType = {
            1: 'За сегодня',
            2: 'Неделю',
            3: 'Месяц',
            4: 'Все время',
            5: dates.length > 0 ? `c ${dates[0]} по ${dates[1]}` : ``,
        }
        let products = await productDTO.getDeliveryReport(user['task1'], type, dates);
        let ws = wb.addWorksheet('Sheet 1');

        ws.cell(1, 1, 1, 5, true).string('RATE THIS\nPROMOTION').style(TitleStyle);
        ws.row(1).setHeight(105);
        ws.cell(1, 6, 1, 10, true).string('Лучший сервис по работе с маркетплейсами!\nТелефон для связи +7 (499) 133-39-37\nСайт : https://rate-this.ru/').style(description);
        ws.cell(2, 1, 2, 10, true).string(`Отчет по выкупам за ${reportType[type]}`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 1).string(`Артикул`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 2).string(`Дата Получения`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 3).string(`Статус`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 4).string(`Цена`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 5).string(`БарКод`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 6).string(`Наименование`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 7).string(`Колличество`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 8).string(`Бренд`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 9).string(`Колличество поллученных`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 10).string(`Пункт Выдачи`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));

        let allCount = 0;
        let allPrice = 0;
        for(let i =0; i < products.length; i++){
            let product = products[i];
            ws.cell(i+4, 1).string(String(product['article']));
            ws.cell(i+4, 2).string(String(product['date_buy'].toLocaleString()));
            ws.cell(i+4, 3).string(String(product['status'] != 2 ? 'Ожидает получения' : 'Оплачено'));
            ws.cell(i+4, 4).string(String(product['price']));
            ws.cell(i+4, 5).string(String(product['barcode']));
            ws.cell(i+4, 6).string(String(product['naming']));
            ws.cell(i+4, 7).string(String(product['cnt']));
            ws.cell(i+4, 8).string(String(product['brand']));
            ws.cell(i+4, 9).string(String(product['fact']));
            ws.cell(i+4, 10).string(String(product['punkt_vidachi']));
            allPrice += product['totalSum'];
            allCount += product['cnt'];
        }
        ws.cell(products.length + 4, 7).string(`Общее колличество`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(products.length + 4, 8).string(String(allCount));
        ws.cell(products.length + 4, 9).string(`Общая цена`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(products.length + 4, 10).string(String(allPrice));
        wb.write('Excel.xlsx');
        await productDTO.setReport(user['task1'], 'delivery', reportType[type]);
        return {};
    }

    async reviewReport(user, type, dates= []){

        let reportType = {
            1: 'За сегодня',
            2: 'Неделю',
            3: 'Месяц',
            4: 'Все время',
            5: dates.length > 0 ? `c ${dates[0]} по ${dates[1]}` : ``,
        }
        let products = await productDTO.getReviewReport(user['task1'], type, dates);
        let ws = wb.addWorksheet('Sheet 1');

        ws.cell(1, 1, 1, 5, true).string('RATE THIS\nPROMOTION').style(TitleStyle);
        ws.row(1).setHeight(105);
        ws.cell(1, 6, 1, 8, true).string('Лучший сервис по работе с маркетплейсами!\nТелефон для связи +7 (499) 133-39-37\nСайт : https://rate-this.ru/').style(description);
        ws.cell(2, 1, 2, 8, true).string(`Отчет по выкупам за ${reportType[type]}`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 1).string(`Артикул`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 2).string(`Дата Получения`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 3).string(`Статус`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 4).string(`Коментарий`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 5).string(`БарКод`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 6).string(`Оценка`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 7).string(`Согласованно`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(3, 8).string(`Бренд`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));

        let allCount = 0;
        let allPrice = 0;
        for(let i =0; i < products.length; i++){
            let product = products[i];
            ws.cell(i+4, 1).string(String(product['article']));
            ws.cell(i+4, 2).string(String(product['date_buy'].toLocaleString()));
            ws.cell(i+4, 3).string(String(product['status'] != 4 ? 'Ожидает согласование' : 'Оставлен'));
            ws.cell(i+4, 4).string(String(product['text_otziv']));
            ws.cell(i+4, 5).string(String(product['barcode']));
            ws.cell(i+4, 6).string(String(product['rating_otziv']));
            ws.cell(i+4, 7).string(product['status'] > 6 ? 'Да' : 'Нет');
            ws.cell(i+4, 8).string(product['brand']);
            allCount += 1;
        }
        ws.cell(products.length + 4, 7).string(`Общее колличество`).style(wb.createStyle({
            alignment: {
                wrapText: true,
            },

            font: {
                bold: true,
                name: 'Montserrat',
                size: 13,
                b: true
            },
        }));
        ws.cell(products.length + 4, 8).string(String(allCount));
        wb.write('Excel.xlsx');
        await productDTO.setReport(user['task1'], 'review', reportType[type]);
        return {};
    }

    async getReports(user, type){
        let answer = await productDTO.getReport(user['task1'] ,type);
        return  answer;
    }
}

//findPosition

module.exports = new product();