const answer = require("../service/Answer");
const productModule = require("../module/product");
const userDB = require('../dto/user');
class Product {
    findByArticle(user ,req, res, next){
        try {
            const {article} = req.body;
            productModule.findByArticle(article)
                .then(response => {
                    return res.json(answer.product(response));
                });


        } catch  (e) {
            next(e);
        }
    }

    findPosition(user ,req, res, next){

        try {
            const {items} = req.body;
            productModule.findPosition(items)
                .then(response => {
                    return res.json(answer.product(response));
                });
            
        } catch  (e) {
            next(e);
        }
    }

    sortBuyByDate(user ,req, res, next){
        try {
            const {items, date} = req.body;
            productModule.sortBuyByDate(items, date)
                .then(response => {
                    return res.json(answer.product(response));
                });

        } catch  (e) {
            next(e);
        }
    }

    findByArticles(user ,req, res, next){

        try {
            const {articles} = req.body;
            productModule.findByArticles(articles)
                .then(response => {
                    return res.json(answer.product(response));
                });

        } catch  (e) {
            next(e);
        }
    }

      getBuyout(user ,req, res, next){

        try {
            const {sort, group} = req.body;

             productModule.getBuyout(user, sort, group)
                 .then(response => {
                     return res.json(answer.product(response));
                 });

        } catch  (e) {
            next(e);
        }
    }

      getDraft(user ,req, res, next){
        try {
            const {group} = req.body;
             productModule.getDraft(user, group);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

      getDelete(user ,req, res, next){

        try {
            const {id} = req.body;
             productModule.getDelete(user, id)
                .then(response => {
                    return res.json(answer.product(response));
                });

        } catch  (e) {
            next(e);
        }
    }

      setReview(user ,req, res, next){
        try {
            const {item} = req.body;

             productModule.saveReview(user, item).then(response => {
                 return res.json(answer.product(response));
             });

        } catch  (e) {
            next(e);
        }
    }

       getDelivery(user ,req, res, next){
        try {
            const {date_get} = req.body;

            productModule.getDelivery(user, date_get)
                .then(response => {
                    return res.json(answer.product(response));
                });
        } catch  (e) {
            next(e);
        }
    }

       parseExcel(req, res, next){
        try {
            console.log(21);
             productModule.parseExcel(/*req.files*/);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

      getReview(user ,req, res, next){

        try {
            const {article} = req.body;

            productModule.getReview(user, article)
                .then(response => {
                    return res.json(answer.product(response));
                });
        } catch  (e) {
            next(e);
        }
    }

      getProductByApi(user ,req, res, next){

        try {
             productModule.getProductByApi(user);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

      save(user ,req, res, next){

        try {
            const {items} = req.body;

            productModule.save(user, items)
                .then(response => {
                    return res.json(answer.product(response));
                });
        } catch  (e) {
            next(e);
        }
    }

      updateDraft(user, req, res, next){
        try {
            const {group, items} = req.body;
             productModule.updateDraft(user, group, items);
            return res.json(answer.product(response));
        } catch  (e) {
            next(e);
        }
    }

      draftSave(user, req, res, next){

        try {
            const {items} = req.body;

            productModule.saveDraft(user, items)
                .then(response => {
                    return res.json(answer.product(response));
                });
        } catch  (e) {
            next(e);
        }
    }

      getGraph(user, req, res, next){

        try {

             productModule.getGraph(user)
                 .then(response => {
                     return res.json(response);
                 });

        } catch  (e) {
            next(e);
        }
    }

      getReport(user, req, res, next){
        try {
            const {type, dates} = req.body;

            productModule.reportBuyout(user,  dates)
                .then(response => {
                    return res.json(answer.product(response));
                });
        } catch  (e) {
            next(e);
        }

    }

      buyoutReport(user, req, res, next){
        try {
            const  {type, dates} = req.body;
            productModule.buyoutReport(user, type, dates)
                .then(response => {
                    return res.json(response);
                });


        } catch (e) {
            console.log(e);
            next(e);
        }
    }
      deliveryReport(user, req, res, next){
        try {
            const  {type, dates} = req.body;
            productModule.deliveryReport(user, type, dates)
                .then(response => {
                return res.json(response);
            });



        } catch (e) {
            console.log(e);
            next(e);
        }
    }

      reviewReport(user, req, res, next){
        try {
            const  {type, dates} = req.body;
            productModule.reviewReport(user, type, dates)
                .then(response => {
                    return res.json(response);
                });


        } catch (e) {
            console.log(e);
            next(e);
        }
    }

      getReport(user, req, res, next){
        try {
            const  {type} = req.body;
            productModule.getReports(user, type)
                .then(response => {
                    return res.json(response);
                });

        } catch (e) {
            console.log(e);
            next(e);
        }
    }


}

module.exports = new Product();