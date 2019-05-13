function addHuman() {
	var _publicKey = document.getElementById("publicKeyForAdd").value;
	var _info = document.getElementById("info").value;
	var _sign = document.getElementById("privateKey").value;

	$.get("/addHuman?publicKey=" + _publicKey + "&info=" + _info + "&sign=" + _sign, function(data) {
		if(data == "Error") {
			$("#message").text("An error occured.");
		}
		else {
			$("#message").html("Transaction hash: " + data);
		}
	});
}

function getHuman() {
	var _publicKey = document.getElementById("publicKeyForGet").value;

	$.get("/getHuman?publicKey=" + _publicKey, function(data) {
		if (data[0] == "" && data[1] == "") {
			$("#message").text("An error occured.");
		}
		else {
			$("#message").html("info : " + data[0] + " sign : " + data[1]);
		}
	});
}