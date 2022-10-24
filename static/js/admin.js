const listQuestion = document.getElementById("list-question");

function display() {
    let collapseShow = document.querySelectorAll('.collapse.show');
    console.log(collapseShow);
    var http = new XMLHttpRequest();
    http.open("GET", "/getListQuestions", true);
    http.setRequestHeader("Content-type","application/json");
    http.send();
    http.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
    http.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT");
    http.setRequestHeader("Pragma", "no-cache");
    http.onload = async function() {
        var datalist = JSON.parse(http.responseText);
        
        while (listQuestion.hasChildNodes()) {
            listQuestion.removeChild(listQuestion.firstChild);
        }
        datalist.forEach(question => {
            listQuestion.appendChild(displayQuestion(question));
        });
        collapseShow.forEach(element => {
            document.getElementById(element.id).classList.add("show");
        });
    }
}

function displayQuestion(question){
    let card = document.createElement('div');
    card.classList.add("card");
    card.classList.add("mb-3");

    let header = document.createElement('div');
    header.setAttribute("class","card-header d-flex justify-content-between align-items-center");
    let collapseClick = document.createElement('div');
    collapseClick.setAttribute("class","col");
    collapseClick.setAttribute("id", "Q-"+question.ID);
    collapseClick.setAttribute("data-bs-toggle","collapse");
    collapseClick.setAttribute("data-bs-target","#answer-"+question.ID);
    let headerItem = '<a class="btn"> '+question.Question+' </a>';
    let checkedText="";
    if(question.Public){
        checkedText = "checked";
    }
    var buttonPublic ='<div class="form-check form-switch pt-2 me-4">'+
      '<input class="form-check-input" type="checkbox" onClick="publicQuestion(\''+question.ID+'\')" name="darkmode" value="yes" '+checkedText+'>' +
      '<label class="form-check-label" for="mySwitch">Công khai</label>' +
    '</div>';
    var buttonRemove = '<button class="btn" onClick="removeQuestion(\''+question.ID+'\')"><span class="fa fa-close"></span></button>';
    var div3 = document.createElement('div');
    div3.setAttribute("class","d-flex");
    div3.innerHTML = buttonPublic + buttonRemove;

    collapseClick.innerHTML = headerItem;
    header.appendChild(collapseClick);
    header.appendChild(div3);

    let collapse = document.createElement('div');
    collapse.setAttribute("id", "answer-"+question.ID);
    collapse.classList.add("collapse");
    let body = document.createElement('div');
    body.classList.add("card-body");
    let ul = document.createElement('ul');
    ul.classList.add("list-group");

    question.Answers.forEach(element => {
        ul.appendChild(displayAnswer(element.id, element.content, element.vote, question.ID));
    });

    let input = '<input type="text" class="form-control"  name="input-'+question.ID+'" placeholder="Thêm đáp án khác" />';
    let button = '<button class="btn btn-success add-answer" onClick="addAnswer(\''+question.ID+'\')"><span class="fa fa-plus"></span> Add</button>';
    let div2 = document.createElement('div');
    div2.classList.add("input-group");
    div2.innerHTML = input + button;

    let div1 = document.createElement('div');
    div1.classList.add("mt-3");
    div1.appendChild(div2);

    body.appendChild(ul);
    body.appendChild(div1);

    collapse.appendChild(body);
    
    card.appendChild(header);
    card.appendChild(collapse);

    //console.log(card);
    return card;
}

function displayAnswer(id, content, vote, parrentID) {
    var li = document.createElement('li');
    li.setAttribute("class","list-group-item d-flex justify-content-between align-items-center");
    
    var div1 = document.createElement('div'); 
    var contentText = '<span>'+content+'</span>';     
    var span = '<span class="badge bg-primary rounded-pill me-2">'+vote+' votes</span>';        
    var button = '<button class="btn btn-danger btn-sm" onClick="removeAnswer(\''+id+'\',\''+parrentID+'\')"><span class="fa fa-close"></span></button>';

    div1.innerHTML = span + button;
    li.innerHTML = contentText;
    li.appendChild(div1);
    //console.log(li);
    return li;
}

function removeQuestion(id){
    const params = {
        questionId: id
    }  
    var http = new XMLHttpRequest();
    http.open("POST", "/deleteQuestion", true);
    http.setRequestHeader("Content-type","application/json");

    http.send(JSON.stringify(params));
    http.onload = function() {
        if(http.responseText=="success"){
            display();
        }else{
            console.log(http.responseText);
        }
    }
}

function addQuestion(){
    const params = {
        question: document.querySelector('input[name="question-content"]').value
    }  
    var http = new XMLHttpRequest();
    http.open("POST", "/addQuestion", true);
    http.setRequestHeader("Content-type","application/json");

    http.send(JSON.stringify(params));
    http.onload = function() {
        if(http.responseText=="success"){
            document.querySelector('input[name="question-content"]').value="";
            display();
        }else{
            console.log(http.responseText);
        }
    }
}

function removeAnswer(answerID, questionID){
    
    const params = {
        answerID : answerID,
        questionID: questionID
    }  
    console.log(params);
    var http = new XMLHttpRequest();
    http.open("POST", "/deleteAnswer", true);
    http.setRequestHeader("Content-type","application/json");

    http.send(JSON.stringify(params));
    http.onload = function() {
        if(http.responseText=="success"){
            display();
        }else{
            console.log(http.responseText);
        }
    }
}

function addAnswer(idQuestion){
    let nameInput = 'input[name="input-'+idQuestion+'"]';
    const params = {
        questionID: idQuestion,
        answer: document.querySelector(nameInput).value
    }  
    var http = new XMLHttpRequest();
    http.open("POST", "/addAnswer", true);
    http.setRequestHeader("Content-type","application/json");

    http.send(JSON.stringify(params));
    http.onload = function() {
        if(http.responseText=="success"){
            document.querySelector(nameInput).value="";
            display();
        }else{
            console.log(http.responseText);
        }
    }
}

function publicQuestion(id){
    const params = {
        questionId: id
    }  
    var http = new XMLHttpRequest();
    http.open("POST", "/publicQuestion", true);
    http.setRequestHeader("Content-type","application/json");

    http.send(JSON.stringify(params));
    http.onload = function() {
        if(http.responseText=="success"){
            display();
        }else{
            console.log(http.responseText);
        }
    }
}

document.addEventListener("DOMContentLoaded", function(event) { 
    display();
});