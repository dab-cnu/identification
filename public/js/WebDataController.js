function addHuman() {
	var _publicKey = document.getElementById("publicKeyForAdd").value;
	var _privateKey = document.getElementById("privateKeyForAdd").value;
	var _info = document.getElementById("info").value;
	
	var _encodedHumanInfo = encodeHumanInfo(_publicKey, _info);
	var _sign = makeSign(_privateKey);

	$.post("/addHuman", { publicKey: sha256(_publicKey), info: _encodedHumanInfo, sign: _sign, function(data) {
		if(data == "Error") {
			$("#message").text("An error occured.");
		}
		else {
			$("#message").html("Transaction hash: " + data);
		}
	}});

	// $.get("/addHuman?publicKey=" + sha256(_publicKey) + "&info=" + _encodedHumanInfo + "&sign=" + _sign, function(data) {
	// 	if(data == "Error") {
	// 		$("#message").text("An error occured.");
	// 	}
	// 	else {
	// 		$("#message").html("Transaction hash: " + data);
	// 	}
	// });
}

function getHuman() {
	var _publicKey = document.getElementById("publicKeyForGet").value;
	var _privateKey = document.getElementById("privateKeyForGet").value;

	$.get("/getHuman?publicKey=" + sha256(_publicKey), function(data) {
		if (data[0] == "" && data[1] == "") {
			$("#message").text("An error occured.");
		}
		else {
			$("#message").html("info : " + decodeHumanInfo(_privateKey, data[0]) + " sign : " + verifySign(_publicKey, data[1]));
		}
	});
}