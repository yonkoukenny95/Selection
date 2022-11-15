const alertMessage = document.getElementById("alert-Message");
function submitForm() {
  const params = {
    username: document.querySelector('input[name="username"]').value,
    password: document.querySelector('input[name="password"]').value,
  };
  var http = new XMLHttpRequest();
  http.open("POST", "/login/auth", true);
  http.setRequestHeader("Content-type", "application/json");

  http.send(JSON.stringify(params));
  http.onload = function () {
    if (http.responseText == "fail") {
      alertMessage.style.display = "block";
    } else {
      location.reload();
    }
  };
}
