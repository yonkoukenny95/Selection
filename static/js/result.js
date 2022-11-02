const listArea = document.getElementById("survey-area");
var totalVote;
function display() {
  var http = new XMLHttpRequest();
  http.open("GET", "/getSurvey", true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
  http.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT");
  http.setRequestHeader("Pragma", "no-cache");
  http.send();
  http.onload = function () {
    while (listArea.hasChildNodes()) {
      listArea.removeChild(listArea.firstChild);
    }
    var questionList = JSON.parse(http.responseText);
    questionList.forEach(displayQuestion);
    showTab();
  };
  sleep(4000).then(() => {
    display();
  });
}

function displayQuestion(value, index, array) {
  var tab = document.createElement("div");
  tab.setAttribute("class", "tab hidden");
  var questionID = document.createElement("input");
  questionID.setAttribute("class", "hidden");
  questionID.setAttribute("name", "question-id");
  questionID.value = value.ID;
  var question = document.createElement("h3");
  question.setAttribute("class", "question-content");
  question.innerHTML = value.Question;
  var answerList = document.createElement("div");
  answerList.setAttribute("class", "box");
  value.Answers.sort(function (a, b) {
    return b.vote - a.vote;
  });
  value.Answers.forEach((element) => {
    answerList.appendChild(displayAnswer(element, value.ID));
  });

  var div = document.createElement("div");
  tab.appendChild(question);
  tab.appendChild(questionID);
  tab.appendChild(answerList);
  tab.appendChild(div);
  listArea.appendChild(tab);
}

function displayAnswer(element, questionID) {
  var div = document.createElement("div");
  var node =
    '<label for="option-' +
    element.id +
    '" class="option-label"><div class="text">' +
    element.content +
    "<span style='color:red'> ( " +
    element.vote +
    " )</span>" +
    "</div></label>";
  div.innerHTML = node;
  return div;
}

document.addEventListener("DOMContentLoaded", function (event) {
  display();
});
