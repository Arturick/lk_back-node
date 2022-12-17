const axios = require('axios');
const productDTO = require('../dto/product');
const userDTO = require('../dto/user');
const productService = require('../service/Product');
const reader = require('xlsx');
const ApiError = require('../exeption/error');
var fs = require('fs');
const errorText = require('../data/error-text');
const xl = require('excel4node');
const wb = new xl.Workbook();
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
    async #getUser(task1){
        let user = {};
        user = await  userDTO.getByTask1(task1);
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

    async getBuyout(task1, sort, group){
        if(!task1 || !sort){
            throw ApiError.BadRequest(errorText.noData);
        }

        let products = await productDTO.getBuyout(task1, sort, group);
        products = await productService.setStatusProduct(products, 'buyout', sort, group);
        let headers = await productService.getHeader('buyout', sort, group);

        return {headers: headers, products: products};
    }

    async getDelivery(task1, date_get){
        if(!task1){
            throw ApiError.BadRequest(errorText.noData);
        }
        console.log(date_get);
        let products = await productDTO.getDelivery(task1, date_get);
        products = await productService.setStatusProduct(products, 'delivery', 1, date_get);

        let headers = await productService.getHeader('delivery', 1, date_get);

        return {headers: headers, products: products};
    }

    async getDelete(task1, id){
        if(!task1 || !id){
            throw ApiError.BadRequest(errorText.noData);
        }

        await productDTO.deleteProduct(task1, id);
        return {};
    }

    async getReview(task1, article){
        if(!task1){
            throw ApiError.BadRequest(errorText.noData);
        }

        let products = await productDTO.getReview(task1, article);
        products = await productService.setStatusProduct(products, 'review', 1, article);
        let headers = await productService.getHeader('review', 1, article);

        return {headers: headers, products: products};
    }

    async getProductByApi(task1){
        if(!task1){
            throw ApiError.BadRequest(errorText.noData);
        }

        let token = await this.#getUser(task1);
        token = token['wb_api_key'];

        let products = await productService.getProductsByApi(token);

        for(let i of products){
            console.log(i['nmId'])
            let product2 = await axios.get(`https://card.wb.ru/cards/detail?spp=0&regions=64,83,4,38,80,33,70,82,86,30,69,22,66,31,40,1,48&pricemarginCoeff=1.0&reg=0&appType=1&emp=0&locale=ru&lang=ru&curr=rub&couponsGeo=2,12,7,3,6,21&dest=-1075831,-115135,-1084793,12358353&nm=${+i['nmId']}`)
                .then(function (res) {

                    return res.data;
                })
                .catch(function (error) {
                    console.log(error);
                })
            if(product2['data']['products'].length < 1){
               continue;
            }
            i['image'] = `https://images.wbstatic.net/c246x328/new/${Math.floor(+i['nmId']/10000)}0000/${String(+i['nmId'])}-1.jpg`
            i['price'] = +product2['data']['products'][0]['salePriceU'] / 100;
            let sizes = [];

            for(let i of product2['data']['products'][0]['sizes']){
                sizes.push(i['origName'])
            }
            i['sizes'] = sizes ;
            i['art'] = i['nmId'];
            i['barcode'] = i['barcode'];
        };
        let header = await productService.getHeader('apiProduct', 1);

        return {headers: header, products: products}
    }

    async parseExcel(){

        let file = reader.readFile(`${process.cwd()}/articles.xlsx`);
        let data = []

        const sheets = file.SheetNames

        for(let i = 0; i < sheets.length; i++)
        {
            const temp = reader.utils.sheet_to_json(
                file.Sheets[file.SheetNames[i]])
            temp.forEach((res) => {
                data.push(res)
            })
        }
        let articles = [];
        console.log(data);
        for(let i = 2; i < data.length; i++){
            articles.push({});
            articles[articles.length - 1]['art'] =  data[i]['RATE THIS \r\nPROMOTION'];
            articles[articles.length - 1]['barcode'] =  data[i].__EMPTY;
            articles[articles.length - 1]['query'] =  data[i]['Лучший сервис по комлексной работе с маркетплейсами!\r\nТелефон для связи +7 (499) 113-39-37, Телегграм: https://t.me/RATE_THISbot,'];
            articles[articles.length - 1]['count'] =  data[i].__EMPTY_1;
            articles[articles.length - 1]['rcount'] =  data[i].__EMPTY_2;
        }
        fs.unlinkSync('D:\\Work\\back-rate_this\\articles.xlsx');
        return articles;
    }

    async getDraft(task1, group = false){
        if(!task1){
            throw ApiError.BadRequest(errorText.noData);
        }
        console.log(group);
        let products = await productDTO.getDraft(task1, group);
        products = await productService.setStatusProduct(products, 'buyout', 3, group);

        let headers = []
        if(group){
            headers = await productService.getHeader('newRequest', 3, group);
        } else {
            headers = await productService.getHeader('buyout', 3, group);
        }
        return {headers: headers, products: products};
    }

    async updateDraft(task1, group, items){
        if(!task1 || !group || !items){
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
        await productDTO.updateDraft(task1, group, products);

        return {};
    }

    async save(task1, items){
        if(!items){
            throw ApiError.BadRequest(errorText.noData);
        }
        let user = await this.#getUser(task1);
        let products = [];
        for(let i of items){
``
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
        await productDTO.save(task1, products, user, group);
        return {}
    }

    async saveDraft(task1, items){
        if(!items){
            throw ApiError.BadRequest(errorText.noData);
        }
        let user = await this.#getUser(task1);
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
        await productDTO.draftSave(task1, products, user, group);
        return {}
    }

    async saveReview(task1, item){
        if(!task1 || !item){
            throw ApiError.BadRequest(errorText.noData);
        }

        await productDTO.setReview(task1, item);

        return {};
    }

    async getGraph(task1){
        if(!task1){
            throw ApiError.BadRequest(errorText.noData);
        }
        let seller1 = await productDTO.getGraph(task1, false);
        let seller2 = await productDTO.getGraph(task1, true);
        let last = [];
        let current = [];
        for(let i of seller1){
            last.push(i['cnt']);
        }
        for(let i of seller2){
            current.push(i['cnt']);
        }
        let count = 0;
        return {
            'last' : last,
            'current' : current,
            'count' : count,
            'sum' : 0,
            'update_date' : new Date(),
            'update_time' : new Date(),
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

    async reportBuyout(task1, type, dates){
        if(!task1 || !type){
            console.log('403');
        }
        let title = {
            1: 'за все время',
            2: 'за неделю',
            3: 'за сегодняшний день',
            4: 'за месяц',
            5: `c ${dates[0].toLocaleDateString().split(',')[0]} по ${dates[1].toLocaleDateString().split(',')[0]}}`,
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
}

//findPosition

module.exports = new product();