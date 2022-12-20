const answer = require("../service/Answer");
const productModule = require("../module/product");
const userDB = require('../dto/user');
class Product {
    async findByArticle(req, res, next){

        try {
            const {article} = req.body;
            let response = await productModule.findByArticle(article);

            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async findPosition(req, res, next){

        try {
            const {items} = req.body;
            let response = await productModule.findPosition(items);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async sortBuyByDate(req, res, next){
        try {
            const {items, date} = req.body;
            let response = await productModule.sortBuyByDate(items, date);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async findByArticles(req, res, next){

        try {
            const {articles} = req.body;
            let response = await productModule.findByArticles(articles);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async getBuyout(req, res, next){

        try {
            const {id, sort, group} = req.body;
            let task1 = await userDB.getById(+id);
            task1 = +task1[0]['task1'];
            let response = await productModule.getBuyout(task1, sort, group);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async getDraft(req, res, next){
        try {
            const {id, group} = req.body;
            let task1 = await userDB.getById(+id);
            task1 = +task1[0]['task1'];
            let response = await productModule.getDraft(task1, group);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async getDelete(req, res, next){

        try {
            const {userId, id} = req.body;
            let task1 = await userDB.getById(+userId);
            task1 = +task1[0]['task1'];
            let response = await productModule.getDelete(task1, id);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async setReview(req, res, next){
        try {
            const {id, item} = req.body;
            let task1 = await userDB.getById(+id);
            task1 = +task1[0]['task1'];
            let response = await productModule.saveReview(task1, item);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async  getDelivery(req, res, next){
        try {
            const {id, date_get} = req.body;
            let task1 = await userDB.getById(+id);
            task1 = +task1[0]['task1'];
            console.log(req.body);
            let response = await productModule.getDelivery(task1, date_get);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async  parseExcel(req, res, next){
        try {
            console.log(req.files);
            let response = await productModule.parseExcel(req.files);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async getReview(req, res, next){

        try {
            const {id, article} = req.body;
            let task1 = await userDB.getById(+id);
            task1 = +task1[0]['task1'];
            let response = await productModule.getReview(task1, article);
            console.log(response);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async getProductByApi(req, res, next){

        try {
            const {id} = req.body;
            let response = await productModule.getProductByApi(id);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async save(req, res, next){

        try {
            const {id, items} = req.body;
            let task1 = await userDB.getById(+id);
            task1 = +task1[0]['task1'];
            let response = await productModule.save(task1, items);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async updateDraft(req, res, next){
        try {
            const {id, group, items} = req.body;
            let task1 = await userDB.getById(+id);
            task1 = +task1[0]['task1'];
            let response = await productModule.updateDraft(task1, group, items);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async draftSave(req, res, next){

        try {
            const {id, items} = req.body;
            let task1 = await userDB.getById(+id);
            task1 = +task1[0]['task1'];
            let response = await productModule.saveDraft(task1, items);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async getGraph(req, res, next){

        try {
            const {id,} = req.body;
            let task1 = await userDB.getById(+id);
            task1 = +task1[0]['task1'];
            let response = await productModule.getGraph(task1);
            return res.json(response);
        } catch  (e) {
            next(e);
        }
    }

    async getReport(req, res, next){
        try {
            const {id, type, dates} = req.body;
            let task1 = await userDB.getById(+id);
            task1 = +task1[0]['task1'];
            let response = await productModule.reportBuyout(task1, type, dates);
            return res.json(response);
        } catch  (e) {
            next(e);
        }

    }

}

module.exports = new Product();