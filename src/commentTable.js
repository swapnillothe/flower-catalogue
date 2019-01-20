class Comment {
  constructor({ Name, comment, date }) {
    this.name = Name;
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
    return '<tr>' +dateRow + nameRow + commentRow + '</tr>';
  }
}

const createTable = function (comments) {
  let tableData = '';
  comments.map(comment => {
    let commentData = new Comment(comment);
    tableData += commentData.getTableFormat();
  });
  return tableData;
}

module.exports = createTable;