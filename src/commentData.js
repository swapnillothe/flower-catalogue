class CommentData {
  constructor(data) {
    this.data = data;
  }

  splitByAnd() {
    return this.data.split('&');
  }

  separateKeyAndValue() {
    return this.splitByAnd().map(arg => {
      return arg.split('=');
    });
  }

  createCommentObject() {
    const commentObject = {};
    commentObject.date = new Date();
    this.separateKeyAndValue().map(arg => {
      const key = arg[0];
      const value = arg[1].replace(/\+/g, ' ');
      commentObject[key] = value;
    })
    return commentObject;
  }
}

const parseComments = function (args) {
  const commentData = new CommentData(args);
  return commentData.createCommentObject();
}

module.exports = parseComments;