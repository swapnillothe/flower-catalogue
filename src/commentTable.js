class Comment {
  constructor({ name, comment, date }) {
    this.name = name;
    this.comment = comment;
    this.date = date;
  }

  getAuthorRow() {
    return `<td>${this.name}</td>`;
  }

  getCommentRow() {
    return `<td>${this.comment}</td>`;
  }

  getDateRow() {
    return `<td>${this.date}</td>`;
  }

  getTableFormat() {
    const nameRow = this.getAuthorRow();
    const commentRow = this.getCommentRow();
    const dateRow = this.getDateRow();
    return '<tr>' + dateRow + nameRow + commentRow + '</tr>';
  }
}

const createTable = function (comments) {
  let tableData = `<table border = 2>
  <tr>
    <th>DateAndTime</th>
    <th>Name</th>
    <th>Comments</th>
  </tr>`;
  comments.forEach(comment => {
    const commentData = new Comment(comment);
    tableData += commentData.getTableFormat();
  });
  tableData += '</table>';
  return tableData;
}

module.exports = createTable;