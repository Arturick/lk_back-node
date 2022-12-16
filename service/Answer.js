class Answer {
    product(data){
        let answer = {}
        answer.success = true;
        answer["data"] = data;
        return answer;
    }
    success(){
        let answer = {}
        answer.success = true;
        answer.data = [];
        return answer;
    }
}

module.exports = new Answer();
