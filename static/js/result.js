const listArea = document.getElementById("survey-area");
var totalVote;

function setRanks(clients) {
  let currentCount = -1,
    currentRank = 0,
    stack = 1;
  for (let i = 0; i < clients.length; i++) {
    const result = clients[i];
    if (currentCount !== result.vote) {
      currentRank += stack;
      stack = 1;
    } else {
      stack++;
    }
    result.ranking = currentRank;
    currentCount = result.vote;
  }
  console.log(clients);
}

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
  sleep(16000).then(() => {
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

  setRanks(value.Answers);

  value.Answers.forEach((element) => {
    answerList.appendChild(displayAnswer(element, value.ID, element.ranking));
  });

  var div = document.createElement("div");
  div.setAttribute("class", "d-flex-custom");
  let div1 = document.createElement("div");
  let div2 = document.createElement("div");
  div1.setAttribute("class", "w-50-custom");
  div2.setAttribute("class", "w-50-custom");
  if (index === array.length - 1) {
    if (index !== 0) {
      let btnPrev = '<button class="btn-custom" onclick="prevTabResult()">Quay lại</button>';
      div1.innerHTML = btnPrev;
    }
    if (typeof isVip === "undefined" || isVip === null) {
      if (div1.innerHTML == "") {
        div2.setAttribute("class", "w-100-custom");
        div1.setAttribute("class", "hidden");
      }
    } else {
      if (div1.innerHTML == "") {
        div2.setAttribute("class", "w-100-custom");
        div1.setAttribute("class", "hidden");
      }
    }
  } else if (index === 0) {
    let btnNext = '<button class="btn-custom" onclick="nextTabResult()">Tiếp theo</button>';
    div2.innerHTML = btnNext;
  } else {
    let btnPrev = '<button class="btn-custom" onclick="prevTabResult()">Quay lại</button>';
    let btnNext = '<button class="btn-custom" onclick="nextTabResult()">Tiếp theo</button>';
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

function displayAnswer(element, questionID, ranking) {
  var div = document.createElement("div");
  let className = "";
  if (ranking == 1) className = "first-prize";
  if (ranking == 2) className = "second-prize";
  if (ranking == 3) className = "third-prize";
  var node =
    '<label for="option-' +
    element.id +
    '" class="option-label ' +
    className +
    '"><div class="text">' +
    element.content +
    "<span> ( " +
    element.vote +
    " )</span>" +
    "</div></label>";
  div.innerHTML = node;
  return div;
}

document.addEventListener("DOMContentLoaded", function (event) {
  display();
});
