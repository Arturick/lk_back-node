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

//import middleware
const authMiddleware = require('../midleware/auth-middleware');
const loginMiddleware = require('../midleware/password');
const spamMiddleware = require('../midleware/spam');
const roleMiddleware = require('../midleware/role');


const upload = multer({ storage: storage });
let type = upload.any();
router.post("/find-by-article",  roleMiddleware.thirdRole,   controller.findByArticle);
router.get("/get-report", authMiddleware,  controller.findByArticle);
router.post("/find-by-articles", roleMiddleware.thirdRole,    controller.findByArticles);
router.post("/find-position", roleMiddleware.thirdRole,  controller.findPosition);
router.post("/buyout", authMiddleware,  controller.getBuyout);
router.post("/draft", authMiddleware,  controller.getDraft);
router.post("/update-draft", roleMiddleware.thirdRole,   controller.updateDraft);
router.post("/reviews", authMiddleware,  controller.getReview);
router.post("/send-update-log", authMiddleware,  user.sendUpdateLog);
router.post("/update-log", roleMiddleware.thirdRole,  user.updateLog);
router.post("/delivery", authMiddleware, controller.getDelivery);
router.post("/delete", authMiddleware, controller.getDelete);
router.post("/save-draft", authMiddleware,   controller.draftSave);
router.post("/get-by-api", authMiddleware,  controller.getProductByApi);
router.post("/save", roleMiddleware.thirdRole, controller.save);
router.post("/graph-info", authMiddleware,  controller.getGraph);
router.post("/sort-buy-by-date", authMiddleware,  controller.sortBuyByDate);
router.post("/update-review", authMiddleware,   controller.setReview);
router.post("/parse-excel", type,  controller.parseExcel);
router.post("/report-buyout", authMiddleware,  controller.getReport);

router.post("/register", user.register);
router.post("/login", loginMiddleware, user.login);
router.post("/refresh-password", user.resetPassword);
router.post("/send-code", spamMiddleware,  user.sendCode);
router.post("/send-reset-code", spamMiddleware, user.sendResetCode);
router.post("/get-profile", authMiddleware,  user.getProfile);
router.post("/update-profile", authMiddleware,   user.updateProfile);
router.post("/get-manager-link",  user.getManagerLink);
router.post("/access-manager",  user.accessManager);

router.post("/add-manager",  roleMiddleware.fourthRole, user.addManger);
router.post("/delete-manager",  roleMiddleware.fourthRole, user.deleteManager);
router.post("/get-manager",   roleMiddleware.fourthRole,  user.getManagers);

//accessManager
router.post("/buyout-report", authMiddleware,  controller.buyoutReport);
router.post("/delivery-report", authMiddleware, controller.deliveryReport);
router.post("/review-report", authMiddleware, controller.reviewReport);
router.post("/get-report", authMiddleware, controller.getReport);



module.exports = router;