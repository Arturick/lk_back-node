const product_service = require('../service/Product');

class Position {
    async addKey(user, key, article){
        let pos = await product_service.findProductByPos(article, key);
        let answer = pos > 0 ? {success: true} :  {error: true};

        return answer;
    }
}

module.exports = new Position();