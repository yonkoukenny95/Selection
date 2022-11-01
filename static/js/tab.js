var currentTab = 0;
const alertMessage = document.getElementById("alert-Message");


function showTab() {
  var x = document.getElementsByClassName("tab");
  x[currentTab].setAttribute("class", "tab");
}

function nextTab() {
  if (validateTab()) {
    var x = document.getElementsByClassName("tab");
    x[currentTab].setAttribute("class", "tab hidden");
    currentTab = currentTab + 1;
    showTab();
  }
}

function prevTab() {
  var x = document.getElementsByClassName("tab");
  x[currentTab].setAttribute("class", "tab hidden");
  currentTab = currentTab - 1;
  alertMessage.style.display = 'none';
  showTab();
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function validateTab() {
  var tab = document.getElementsByClassName("tab");
  var checked = tab[currentTab].querySelectorAll('input:checked');
  if (checked.length < 3) {
    alertMessage.style.display = 'block';
    sleep(5000).then(() => {
      alertMessage.style.display = 'none';
    });
    return false;
  } else {
    alertMessage.style.display = 'none';
    return true;
  }
}
