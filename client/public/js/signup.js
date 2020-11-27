document.getElementById("signupForm").onsubmit = function () {
  let userName = document.getElementById("userNameInput").value;
  let name = document.getElementById("nameInput").value;
  let email = document.getElementById("emailInput").value;
  let password = document.getElementById("passwordInput").value;
  let data = {
    userName: userName,
    name: name,
    email: email,
    password: password,
  };
  fetch("/signup", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status == 200) {
        localStorage.setItem("token", JSON.stringify(data.token));
        localStorage.setItem("userDetails", JSON.stringify(data.details));
        window.location.replace("/");
      } else {
        alert(data.message);
      }
    });
  return false;
};
