const answer = require("../service/Answer");
const productModule = require("../module/product");
const userDB = require('../dto/user');
class Product {
    async findByArticle(user ,req, res, next){

        try {
            const {article} = req.body;
            let response = await productModule.findByArticle(article);

            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async findPosition(user ,req, res, next){

        try {
            const {items} = req.body;
            let response = await productModule.findPosition(items);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async sortBuyByDate(user ,req, res, next){
        try {
            const {items, date} = req.body;
            let response = await productModule.sortBuyByDate(items, date);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async findByArticles(user ,req, res, next){

        try {
            const {articles} = req.body;
            let response = await productModule.findByArticles(articles);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async getBuyout(user ,req, res, next){

        try {
            const {sort, group} = req.body;

            let response = await productModule.getBuyout(user, sort, group);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async getDraft(user ,req, res, next){
        try {
            const {group} = req.body;
            let response = await productModule.getDraft(user, group);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async getDelete(user ,req, res, next){

        try {
            const {id} = req.body;

            let response = await productModule.getDelete(user, id);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async setReview(user ,req, res, next){
        try {
            const {item} = req.body;

            let response = await productModule.saveReview(user, item);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async  getDelivery(user ,req, res, next){
        try {
            const {date_get} = req.body;

            let response = await productModule.getDelivery(user, date_get);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async  parseExcel(req, res, next){
        try {
            console.log(21);
            let response = await productModule.parseExcel(/*req.files*/);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async getReview(user ,req, res, next){

        try {
            const {article} = req.body;

            let response = await productModule.getReview(user, article);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async getProductByApi(user ,req, res, next){

        try {
            let response = await productModule.getProductByApi(user);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async save(user ,req, res, next){

        try {
            const {items} = req.body;

            let response = await productModule.save(user, items);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async updateDraft(user, req, res, next){
        try {
            const {group, items} = req.body;
            let response = await productModule.updateDraft(user, group, items);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async draftSave(user, req, res, next){

        try {
            const {items} = req.body;

            let response = await productModule.saveDraft(user, items);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

    async getGraph(user, req, res, next){

        try {

            let response = await productModule.getGraph(user);
            return res.json(response);
        } catch  (e) {
            next(e);
        }
    }

    async getReport(user, req, res, next){
        try {
            const {type, dates} = req.body;

            let response = await productModule.reportBuyout(user,  dates);
            return res.json(response);
        } catch  (e) {
            next(e);
        }

    }

}

module.exports = new Product();