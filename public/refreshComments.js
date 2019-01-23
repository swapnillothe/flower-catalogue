const refreshComments = () => {
  fetch('/comments')
    .then(function (response) {
      return response.text();
    }).then(function (data) {
      document.getElementById("userComments").innerHTML = data;
    });
};

window.onload = refreshComments();