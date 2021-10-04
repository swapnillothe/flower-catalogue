const createElementWithText = (tag, text) =>{
  const element = document.createElement(tag);
  element.innerText = text;
  return element
}

const refreshComments = (document) => {
  fetch('/comments')
    .then(function (response) {
      return response.json();
    }).then(function (comments) {
      const userCommentsDiv = document.getElementById("userComments");
      userCommentsDiv.innerHTML = '';

      const table = document.createElement('table');
      const rowHeading = document.createElement('tr');

      const nameHeading = createElementWithText('th', 'Name');
      const dateHeading = createElementWithText('th', 'Date and time');
      const commentHeading = createElementWithText('th', 'Comments');

      rowHeading.append(dateHeading, nameHeading, commentHeading);
      table.append(rowHeading);

      comments.forEach(comment => {
        const row = document.createElement('tr');

        const nameTr = createElementWithText('td', comment.name);
        const commentTr = createElementWithText('td', comment.comment);
        const dateTr = createElementWithText('td', comment.date);;

        row.append(nameTr, dateTr, commentTr);
        table.append(row)
      });

      userCommentsDiv.append(table);
    });
};

window.onload = refreshComments(document);