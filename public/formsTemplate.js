const forms ={
  logInForm: () => `
<h2 style="margin-left:20px;">Login to comment</h2>
<form action="/login" method="POST" style="padding:10px; margin-left: 30px;">
Name:
<input type="text" name="name" required>
<input type="submit" value="Login" class="buttons" >
</form>
<br><br>`,

  commentForm: (name) =>
    `<h2 style="margin-left:20px;">Leave a comment</h2>
	<form action="/logout" method="POST" style="padding:10px; margin-left: 30px;">
		Name: ${name}
		<input type="submit" value="Logout" class="buttons" >
		</form>
		<form action="/guestBook.html" method="POST" style="padding:10px; margin-left: 30px;">
		Comment:
		<textarea type="text" name="comment" style="width:150px; height:8"></textarea>
		<br><br>
		<input type="submit" value="Submit" class="buttons" >
	</form>`,
}

module.exports = forms; 
