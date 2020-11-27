const button = document.getElementById("tweet-button");
button.addEventListener("click", () => {
  fetch("/tweet", {
    headers: { token: JSON.parse(localStorage.getItem("token")) },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
});
