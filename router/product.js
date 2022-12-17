const Router = require('express').Router;
const router = new Router();
const multer = require('multer');
const controller = require('../controller/product');
const user = require('../controller/user');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './')
    },
    filename: function (req, file, cb) {
        cb(null, 'articles.xlsx') //Appending extension
    }
})



const upload = multer({ storage: storage });
let type = upload.any();
router.post("/findByArticle", controller.findByArticle);
router.get("/getReport", controller.findByArticle);
router.post("/findByArticles", controller.findByArticles);
router.post("/findPosition", controller.findPosition);
router.post("/buyout", controller.getBuyout);
router.post("/draft", controller.getDraft);
router.post("/update-draft", controller.updateDraft);
router.post("/reviews", controller.getReview);
router.post("/delivery",controller.getDelivery);
router.post("/delete",controller.getDelete);
router.post("/saveDraft",controller.draftSave);
router.post("/getByApi", controller.getProductByApi);
router.post("/save", controller.save);
router.post("/graphInfo", controller.getGraph);
router.post("/sortBuyByDate", controller.sortBuyByDate);
router.post("/updateReview", controller.setReview);
router.post("/parseExcel", type, controller.parseExcel);
router.post("/reportBuyout", controller.getReport);
router.post("/register", user.register);
router.post("/login", user.login);
router.post("/sendCode", user.sendCode);
router.post("/getProfile", user.getProfile);
router.post("/updateProfile", user.updateProfile);

module.exports = router;