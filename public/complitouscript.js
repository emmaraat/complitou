function submitCompliment() {
	console.log("Data processing");
	//extract values here
	targetemail = document.forms["complimentForm"]["theirEmail"].value;
	receivername = document.forms["complimentForm"]["theirName"].value;
	compliment = document.forms["complimentForm"]["complimentContent"].value;
	senderemail = document.forms["complimentForm"]["yourEmail"].value;
	inputdata = {"email": targetemail, "name": receivername, "message": compliment, "sender":senderemail}

	jsonInput = JSON.stringify(inputdata)

	console.log(inputdata)
	$.ajax({ //this requires jQuery
			type: 'post',
			cache: false,
			url: 'http://localhost:3000/email', // this is the path
			body: jsonInput,

			success: function(msg) {
				console.log(msg)
				document.getElementById('myCompliment').innerHTML = "Compliment received! Please check your email address to validate the sender."
				console.log("Data posted");
			}
		});
}


// $("form").submit(function(e) {
//     e.preventDefault(); // Prevents the page from refreshing
//     var $this = $(this); // `this` refers to the current form element
//     $.post(
//         $this.attr("action"), // Gets the URL to sent the post to
//         $this.serialize(), // Serializes form data in standard format
//         function(data) { /** code to handle response **/ },
//         "json" // The format the response should be in
//     );
// });

function myFunction() {
  document.getElementById("demo").style.color = "red";
}