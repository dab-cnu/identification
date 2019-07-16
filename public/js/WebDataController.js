function addHuman() {
	var _publicKey = document.getElementById("publicKeyForAdd").value;
	var _privateKey = document.getElementById("privateKeyForAdd").value;
	var _info = document.getElementById("info").value;
	var image = document.getElementById("image").files[0];

	var _encodedHumanInfo = encodeHumanInfo(_publicKey, _info);
	var _sign = makeSign(_privateKey);
	
	var reader = new FileReader();

	reader.onload = function(e) {
		var encryped_image = CryptoJS.AES.encrypt(e.target.result, _privateKey);

		$.post("/addHumanPage/addHuman", { publicKey: sha256(_publicKey), info: _encodedHumanInfo, sign: _sign, image: encryped_image.toString() }, function(data) {
			if(data == "Error") {
				$("#message").text("An error occured.");
			}
			else {
				$("#message").html("Transaction hash: " + data);
			}
		});
	}
	reader.readAsDataURL(image);
}

function getHuman() {
	var _publicKey = document.getElementById("publicKeyForGet").value;
	var _privateKey = document.getElementById("privateKeyForGet").value;

	$.get("/getHumanPage/getHuman?publicKey=" + sha256(_publicKey), function(data) {
		if (data[0] == "" && data[1] == "") {
			$("#message").text("An error occured.");
		}
		else {
			$("#message").html("info : " + decodeHumanInfo(_privateKey, data[0]));
			var decrypted = CryptoJS.AES.decrypt(data[2], _privateKey).toString(CryptoJS.enc.Latin1);
			$("#testimage").attr("src", decrypted);
		}
	});
}

function verify() {
	var _publicKey = document.getElementById("publicKeyForGet").value;

	$.get("/getHumanPage/getHuman?publicKey=" + sha256(_publicKey), function(data) {
		if (data[0] == "" && data[1] == "") {
			alert('falied...');
		}
		else {
			if (verifySign(_publicKey, data[1])) {
				alert('인증 확인되었습니다.');
			}
			else {
				alert('인증 실패하였습니다.');
			}
		}
	});
}