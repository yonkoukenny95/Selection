const list = document.getElementById("option-list");
const listArea = document.getElementById("survey-area");
const isVip = document.getElementById("isVipMember");
function display() {
    var http = new XMLHttpRequest();
    http.open("GET", "/getSurvey", true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    http.send();
    http.onload = function() {
        while (listArea.hasChildNodes()) {
            listArea.removeChild(listArea.firstChild);
        }       
        var questionList = JSON.parse(http.responseText);
        questionList.forEach(displayQuestion);
        showTab();
    }
}

function displayQuestion(value, index, array) {
    var tab = document.createElement('div');
    tab.setAttribute("class","tab hidden");
    var questionID = document.createElement('input');
    questionID.setAttribute("class","hidden");
    questionID.setAttribute("name","question-id");
    questionID.value = value.ID;
    var question = document.createElement('h3');
    question.setAttribute("class","question-content");
    question.innerHTML = value.Question;
    var answerList = document.createElement('div');
    answerList.setAttribute("class","box");
    value.Answers.forEach(element => {
        answerList.appendChild(displayAnswer(element, value.ID));
    });
    var div = document.createElement('div');
    div.setAttribute("class","d-flex-custom");
    let div1 = document.createElement('div');
    let div2 = document.createElement('div');
    div1.setAttribute("class","w-50-custom");
    div2.setAttribute("class","w-50-custom");
    if(index === (array.length-1)){  
        if(index !== 0){
            let btnPrev = '<button class="btn-custom" onclick="prevTab()">Quay lại</button>';
            div1.innerHTML = btnPrev;
        }
        console.log(isVip);
        if (typeof(isVip) === "undefined" || isVip === null) {
            let btnSubmit = '<button class="btn-custom" id="btn-submit" onclick="submitForm()">Bình chọn</button>';       
            div2.innerHTML = btnSubmit;
        } else {
            let btnSubmit = '<button class="btn-custom" id="btn-submit" onclick="submitVIPAnswers()">Bình chọn</button>';       
            div2.innerHTML = btnSubmit;
        }
    }else if(index === 0){
        let btnNext = '<button class="btn-custom" onclick="nextTab()">Tiếp theo</button>';       
        div2.innerHTML = btnNext;
    }else{  
        let btnPrev = '<button class="btn-custom" onclick="prevTab()">Quay lại</button>';
        let btnNext = '<button class="btn-custom" onclick="nextTab()">Tiếp theo</button>';     
        div1.innerHTML = btnPrev;
        div2.innerHTML = btnNext;     
    }
    div.appendChild(div1);
    div.appendChild(div2);
   
    tab.appendChild(question);
    tab.appendChild(questionID);
    tab.appendChild(answerList);
    tab.appendChild(div);
    listArea.appendChild(tab);
}

function displayAnswer(element, questionID) {
    var div = document.createElement('div');
    var node = '<input type="radio" name="answer-'+questionID+'" class="option-custom" value="'+element.id+'" id="option-'+element.id+'" />' +
               '<label for="option-'+element.id+'" class="option-label"><div class="dot"></div><div class="text">'+element.content+'</div></label>';
    div.innerHTML = node;
    return div;
}

function submitForm() {
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
        http.open("POST", "/submitAnswers", true);
        http.setRequestHeader("Content-type","application/json");
    
        http.send(JSON.stringify(params));
        http.onload = function() {
            location.reload();
        }
    }
}

document.addEventListener("DOMContentLoaded", function(event) { 
    display();
});