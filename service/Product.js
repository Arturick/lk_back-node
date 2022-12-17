const axios = require('axios');

class ProductService {

    async getProductsByApi(token){

        let link = `https://suppliers-api.wildberries.ru/api/v2/stocks?search= &skip=0&take=98`;
        let product = await axios.get(link, {headers: {"authorization": token}})
            .then(data => {
                return data['data']['stocks'];
            })
            .catch(error => {
                console.log(error);
            });
        return product;
    }

    async findProductByPos(article, query){
        if(!article || !query){
            return null;
        }
        let position = -1,
            isPosition = false,
            needProduct = await this.findProductByArt(article);
        console.log(needProduct);
        for(let i = 1; i<65; i++){
            await axios.get(`https://search.wb.ru/exactmatch/ru/common/v4/search?appType=1&couponsGeo=12,3,18,15,21&curr=rub&dest=-1029256,-102269,-2162196,-1257786&emp=0&lang=ru&locale=ru&page=${i}&pricemarginCoeff=1.0&query=${query}&reg=0&regions=68,64,83,4,38,80,33,70,82,86,75,30,69,22,66,31,40,1,48,71&resultset=catalog&sort=popular&spp=0&suppressSpellcheck=false`)
                .then(answer => {
                    if(!answer['data']['data']){return}
                    answer['data']['data']['products'].map(product => {

                        if(product['id'] == article || (needProduct['brand'] == product['brand'] && needProduct['naming'] == product['name'])){

                            isPosition = true;
                            position = i * 100;
                        }
                    })
                })
                .then(error => {

                })
            if(isPosition){
                break;
            }
        }

        return  {pos: position, art: article, 'query': query}
    }

    async findProductByArt(article){
        let productList = {

        }
        if(!article){
            return null;
        }
        let product = await axios.get(`https://wbx-content-v2.wbstatic.net/ru/${article}.json`)
            .then(function (res) {

                return res.data;
            })
            .catch(function (error) {
                console.log(error);
            })
        let product2 = await axios.get(`https://card.wb.ru/cards/detail?spp=0&regions=64,83,4,38,80,33,70,82,86,30,69,22,66,31,40,1,48&pricemarginCoeff=1.0&reg=0&appType=1&emp=0&locale=ru&lang=ru&curr=rub&couponsGeo=2,12,7,3,6,21&dest=-1075831,-115135,-1084793,12358353&nm=${article}`)
            .then(function (res) {

                return res.data;
            })
            .catch(function (error) {
                console.log(error);
            })

        if(!product){
            return false;
        }
        if(product2['data']['products'].length < 1){
            return null
        }
        productList['image'] = `https://images.wbstatic.net/c246x328/new/${Math.floor(+article/10000)}0000/${String(article)}-1.jpg`
        productList['brand'] = product['selling']['brand_name'];
        productList['article'] = String(article);
        console.log(product2['data']['products'][0]['sizes']);
        productList['price'] = +product2['data']['products'][0]['salePriceU'] / 100;
        productList['naming'] = product2['data']['products'][0]['name'];

        productList['description'] = product['description'];
        let sizes = [];

        for(let i = 0; i < product2['data']['products'][0]['sizes'].length; i++){
            if(product2['data']['products'][0]['sizes'][i]['name'] == ''){
                continue;
            }
            sizes.push(product2['data']['products'][0]['sizes'][i]['name']);
        }
        productList['sizes'] = sizes;

        art: "48379232"
        productList['barcode'] = "";
        brand: "GarnetBiz"
        productList['copy'] =  ""
        productList['count'] = 1
        let dt = new Date();
        productList['date_add'] = `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;

        productList['del'] = ""
        productList['query'] =  ""
        productList['size'] =  "0"
        productList['position'] =  -1
        productList['rcount'] =  0

        return productList;
    }

    async getHeader(type, sort, group = false){

        switch(type){
            case 'buyout':
                if(!group){
                    return [{"text": "Заявка от", "value": 'date', 'sortable': false},
                    {"text": "Заказов план", "value": 'plan', 'sortable': false},
                    {"text": "Заказов факт", "value": 'fact', 'sortable': false},
                    {"text": "Статус", "value": 'status', 'sortable': false},
                    {"text": "", "value": 'actions', 'sortable': false},];
                }
                switch (sort) {
                    case 1:
                        return [ {"name" : "Фото", "key" : 'image', "text" : "Фото", "value" : 'image', 'sortable' : false},
                    {"name" : "Бренд", "key" : 'brand', "text" : "Бренд", "value" : 'brand', 'sortable' : false},
                    {"name" : "Артикул", "key" : 'art', "text" : "Артикул", "value" : 'art', 'sortable' : false},
                    {"name" : "Цена WB", "key" : 'price', "text" : "Цена WB", "value" : 'price_wb', 'sortable' : false},
                    {"name" : "Размер", "key" : 'size', "text" : "Размер", "value" : 'size', 'sortable' : false},
                    {"text" : "Кол-во план", "value" : 'plan', 'sortable' : false},
                    {"text" : "Кол-во факт", "value" : 'fact', 'sortable' : false},
                            {"name" : "Статус", "key" : 'status', "text" : "Статус", "value" : 'status', 'sortable' : true},
                            {"text": "", "value": 'action', 'sortable': false}];

                        break;
                    case 2:
                        return [{"text" : "Дата выкупа", "value" : 'date', 'sortable' : false},
                    {"text" : "Кол-во план", "value" : 'plan', 'sortable' : false},
                    {"text" : "Кол-во факт", "value" : 'fact', 'sortable' : false},
                            {"name" : "Статус", "key" : 'status', "text" : "Статус", "value" : 'status', 'sortable' : true},

                            {"text": "", "value": 'action', 'sortable': false}];

                        break;
                    case 3:
                        return [{"name" : "Фото", "key" : 'image', "text" : "Фото", "value" : 'image', 'sortable' : false},
                    {"name" : "Бренд", "key" : 'brand', "text" : "Бренд", "value" : 'brand', 'sortable' : false},
                    {"name" : "Артикул", "key" : 'art', "text" : "Артикул", "value" : 'art', 'sortable' : false},
                    {"name" : "Цена WB", "key" : 'price', "text" : "Цена WB", "value" : 'price_wb', 'sortable' : true},
                    {"name" : "Размер", "key" : 'size', "text" : "Размер", "value" : 'size', 'sortable' : false},
                    {"name" : "Баркод", "key" : 'barcode', "text" : "Баркод", "value" : 'barcode', 'sortable' : false},
                    {"name" : "Запрос", "key" : 'search_key', "text" : "Запрос", "value" : 'search_key', 'sortable' : false},
                    {"name" : "Пол", "key" : 'sex', "text" : "Пол", "value" : 'sex', 'sortable' : false},
                    {"name" : "Дата выкупа", "key" : 'date', "text" : "Дата выкупа", "value" : 'date', 'sortable' : true},
                    {"name" : "Статус", "key" : 'status', "text" : "Статус", "value" : 'status', 'sortable' : true},
                        {"text": "", "value": 'actions', 'sortable': false}];

                        break;

                }


                break;
            case 'review':
                return group ? [ {"text" : "Фото", "value" : 'image', 'sortable' : false},
                {"text" : "Артикул", "value" : 'art', 'sortable' : false},
                {"text" : "Цвет", "value" : 'color', 'sortable' : false},
                {"text" : "Размер", "value" : 'size', 'sortable' : false},
                {"text" : "Текст отзыва", "value" : 'review', 'sortable' : false, 'width': '300px'},
                {"text" : "Кол-во звезд", "value" : 'rating', 'sortable' : false},
                {"text" : "Фото", "value" : 'photos', 'sortable' : false, 'width': '200px'},
                {"text" : "Согласован?", "value" : 'agreed', 'sortable' : false},
                {"text" : "Стутус", "value" : 'status', 'sortable' : false},
                {"text" : "Дата публикации", "value" : 'date', 'sortable' : false},
                {"text" : "", "value" : 'action', 'sortable' : false},] : [  {"text" : "Фото", "value" : 'image', 'sortable' : false},
                {"text" : "Артикул", "value" : 'art', 'sortable' : false},
                {"text" : "Отзывов план", "value" : 'plan', 'sortable' : false},
                {"text" : "Опубликовано", "value" : 'fact', 'sortable' : false},
                {"text" : "Статус", "value" : 'status', 'sortable' : false},
                {"text" : "", "value" : 'action', 'sortable' : false}];
                break;
            case 'delivery':

                    return group ? [ {"text" : "Фото", "value" : 'image', 'sortable' : false},
                {"text" : "Артикул", "value" : 'art', 'sortable' : false},
                {"text" : "Размер", "value" : 'size', 'sortable' : false},
                        {"text" : "Дата покупки", "value" : 'date', 'sortable' : false},
                        {"text" : "Чек", "value" : 'cheque', 'sortable' : false},
                        {"text" : "Дата получения", "value" : 'date_get', 'sortable' : false},
                        {"text" : "Статус", "value" : 'status', 'sortable' : false},] : [ {"text" : "Дата", "value" : 'date', 'sortable' : false},
                    {"text" : "План", "value" : 'plan', 'sortable' : false},
                    {"text" : "Получено товаров", "value" : 'fact', 'sortable' : false},
                    {"text" : "Статус", "value" : 'status', 'sortable' : false},
                    {"text" : "", "value" : 'action', 'sortable' : false}];


                break;
            case 'apiProduct':
                return [{'name' : '', "key" : 'check', "value" : 'check', 'sortable' : false},
                {"name" : "Фото", "key" : 'image', "text" : "Фото", "value" : 'image', 'sortable' : false},
                {"name" : "Бренд", "key" : 'brand', "text" : "Бренд", "value" : 'brand', 'sortable' : false},
                {"name" : "Артикул", "key" : 'art', "text" : "Артикул", "value" : 'art', 'sortable' : false},
                {"name" : "Цена WB", "key" : 'price', "text" : "Цена WB", "value" : 'price_wb', 'sortable' : false},
                {"name" : "Размер", "key" : 'size', "text" : "Размер", "value" : 'size', 'sortable' : false},
                {"name" : "Баркод", "key" : 'barcode', "text" : "Баркод", "value" : 'barcode', 'sortable' : false}];
                break;
            case 'newRequest':
                return [ {"name" : "Фото", "key" : 'image', "text" : "Фото", "value" : 'image', 'sortable' : false},
                {"name" : "Бренд", "key" : 'brand', "text" : "Бренд", "value" : 'brand', 'sortable' : false},
                {"name" : "Артикул", "key" : 'article', "text" : "Артикул", "value" : 'article', 'sortable' : false},
                {"name" : "Цена WB", "key" : 'price', "text" : "Цена WB", "value" : 'price', 'sortable' : false},
                {"name" : "Размер", "key" : 'size', "text" : "Размер", "value" : 'size', 'sortable' : false},
                {"name" : "Баркод", "key" : 'barcode', "text" : "Баркод", "value" : 'barcode', 'sortable' : false},
                {"name" : "Кол-во выкупов", "key" : 'count', "text" : "Кол-во выкупов", "value" : 'count', 'sortable' : false},
                {"name" : "Кол-во отзывов", "key" : 'rcount', "text" : "Кол-во отзывов", "value" : 'rcount', 'sortable' : false},
                {"name" : "Запрос", "key" : 'query', "text" : "Запрос", "value" : 'query', 'sortable' : false},
                {"name" : "Позиция", "key" : 'position', "text" : "Позиция", "value" : 'position', 'sortable' : false},
                {"name" : "Пол", "key" : 'gender', "text" : "Пол", "value" : 'gender', 'sortable' : false},
                {"name" : "", "key" : 'copy', "value" : 'copy', 'sortable' : false},
                {"name" : "", "key" : 'del', "value" : 'del', 'sortable' : false}];
                break;
            case 'oldRequest':
                return [ {"name" : "Фото", "key" : 'image', "text" : "Фото", "value" : 'image', 'sortable' : false},
                    {"name" : "Бренд", "key" : 'brand', "text" : "Бренд", "value" : 'brand', 'sortable' : false},
                    {"name" : "Артикул", "key" : 'article', "text" : "Артикул", "value" : 'article', 'sortable' : false},
                    {"name" : "Цена WB", "key" : 'price', "text" : "Цена WB", "value" : 'price_wb', 'sortable' : false},
                    {"name" : "Размер", "key" : 'size', "text" : "Размер", "value" : 'size', 'sortable' : false},
                    {"name" : "Баркод", "key" : 'barcode', "text" : "Баркод", "value" : 'barcode', 'sortable' : false},
                    {"name" : "Кол-во выкупов", "key" : 'count', "text" : "Кол-во выкупов", "value" : 'count', 'sortable' : false},
                    {"name" : "Кол-во отзывов", "key" : 'rcount', "text" : "Кол-во отзывов", "value" : 'rcount', 'sortable' : false},
                    {"name" : "Запрос", "key" : 'query', "text" : "Запрос", "value" : 'query', 'sortable' : false},
                    {"name" : "Позиция", "key" : 'position', "text" : "Позиция", "value" : 'position', 'sortable' : false},
                    {"name" : "Пол", "key" : 'gender', "text" : "Пол", "value" : 'gender', 'sortable' : false},
                    {"name" : "Дата", "key" : 'Дата', "text" : "Дата", "value" : 'date', 'sortable' : false},

                    {"name" : "", "key" : 'copy', "value" : 'copy', 'sortable' : false},
                    {"name" : "", "key" : 'del', "value" : 'del', 'sortable' : false}];
                break;
        }
    }

    setStatusGroup(products, statuses){
        for(let i in products){
            let product = products[i];
            console.log(product['status']);
            if(product['status'] == 'черновик'){
                products[i]['status'] = 'Черновик|plan';
                products[i]['date'] = `${product['date'].getFullYear()}-${product['date'].getMonth() + 1}-${product['date'].getDate()}`;
            } else {
                if(product['plan'] != product['fact']){
                    products[i]['status'] = statuses[0];
                }  else {
                    products[i]['status'] = statuses[1];
                }
            }


        }
        return products;
    }

    setStatus(products, statuses){
        for(let i in products){
            let product = products[i];
            if(!product['date']){

            }
             console.log(product['status'] == 'черновик');
            if(product['status'] == 'черновик'){
                product['status'] = 'черновик|plan';
            }else{
                let minus = new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`).getTime() - new Date(`${new Date(product['grafik']).getFullYear()}-${new Date(product['grafik']).getMonth() + 1}-${new Date(product['grafik']).getDate()}`).getTime();

                if(minus > 86300000  && product['status'] < 2){
                    products[i]['status'] = 'Не оплачено|dunger';
                } else if(minus < -86300000 && product['status'] < 2){
                    products[i]['status'] = 'Запланировано|plan';
                } else if(product['status'] < 2){
                    products[i]['status'] = 'В процессе|process';
                }
                if(+products[i]['status']){
                    products[i]['status'] = statuses[product['status']] ? statuses[product['status']] : 'Оплачено|succses';
                } else {
                    products[i]['status'] = statuses[product['status']];
                }

                if(products[i]['date']){
                    products[i]['date'] = `${new Date(product['date']).getFullYear()}-${new Date(product['date']).getMonth() + 1}-${new Date(product['date']).getDate()}`;
                }
            }
            if(!products[i]['status']){
                products[i]['status'] = 'В процессе|process'
            }
            //console.log(`${product['date'].getFullYear()}-${product['date'].getMonth() + 1}-${product['date'].getDate()}`);

        }
        return products;
    }

    async setStatusProduct(products, type, sort, group = false){
        let statuses = {};
        switch (type) {
            case 'buyout':
                statuses = {'0' : 'Запланировано|plan',
                    'Заявка': 'Запланировано|plan',
                    'черновик': 'Зерновик|plan',
                    '-1' : 'Запланировано|plan',
                    '' : 'Запланировано|plan',
                    null : 'Запланировано|plan',
                    undefined : 'Запланировано|plan',
                    '1' : 'Запланировано|plan',
                    '2' : 'Оплачено|succses',
                    '3' : 'Оплачено|succses',
                    '4' : 'Оплачено|succses',
                    '5' : 'Оплачено|succses',
                    '6' : 'Оплачено|succses',
                    '7' : 'Оплачено|succses',
                    '8' : 'Оплачено|succses',
                    '9' : 'Не оплачено|dunger',
                    '11' : 'В процессе|process',
                    'no-money' : 'Недостаточно средств|dunger'
                };
                console.log()
                return group && sort == 3? this.setStatus(products, statuses) : this.setStatusGroup(products, ['В процессе|process', 'Оплачено|succses'])
                break;
            case 'delivery':
                statuses = {'0' : 'Запланировано|plan',
                    '-1' : 'Запланировано|plan',
                    '' : 'Запланировано|plan',
                    null : 'Запланировано|plan',
                    undefined : 'Запланировано|plan',
                    '1' : 'Запланировано|plan',
                    '2' : 'Ожидает получание|process',
                    '3' : 'Ожидает получание|process',
                    '4' : 'Получено|succses',
                    '5' : 'Получено|succses',
                    '6' : 'Получено|succses',
                    '7' : 'Получено|succses',
                    '8' : 'Получено|succses',
                    '9' : 'Не оплачено|dunger',
                    '11' : 'В процессе|process',
                    'no-money' : 'Недостаточно средств|dunger'
                };
                return !group == false ? this.setStatus(products, statuses) : this.setStatusGroup(products, ['В процессе|process', 'Забранно|succses'])
                break;
            case 'review':
                statuses = {'0' : 'Запланировано|plan',
                    '-1' : 'Запланировано|plan',
                    '' : 'Запланировано|plan',
                    null : 'Запланировано|plan',
                    undefined : 'Запланировано|plan',
                    '1' : 'Запланировано|plan',
                    '2' : 'Ожидает получание|process',
                    '3' : 'Ожидает получание|process',
                    '4' : 'Согласовать|plan',
                    '5' : 'В процессе|process',
                    '6' : 'Опубликован|succses',
                    '7' : 'Опубликован|succses',
                    '8' : 'Удалён|succses',
                    '9' : 'Не оплачено|dunger',
                    '11' : 'В процессе|process',
                    'no-money' : 'Недостаточно средств|dunger'
                };
                return group ? this.setStatus(products, statuses) : this.setStatusGroup(products, ['В процессе|process', 'Опубликованно|succses'])
                break;
        }
    }
}

module.exports = new ProductService();