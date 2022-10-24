var isVIP = document.createElement('input');
isVIP.setAttribute("class","hidden");
isVIP.setAttribute("id","isVipMember");
isVIP.value =true;
document.body.appendChild(isVIP);

function submitVIPAnswers() {
    if(validateTab()){
        var answers = [];
        var tab = document.getElementsByClassName("tab");
        for (let element of tab) {
            let qID = element.querySelector('input[name="question-id"]').value.toString();
            answers.push({
                answerID: element.querySelector('input[name="answer-'+qID+'"]:checked').value.toString(),
                questionID: qID
            });
        }
        const params ={
            answers: answers
        }
        console.log(params);
        var http = new XMLHttpRequest();
        http.open("POST", "/submitVIPAnswers", true);
        http.setRequestHeader("Content-type","application/json");
    
        http.send(JSON.stringify(params));
        http.onload = function() {
            location.reload();
        }
    }
}
