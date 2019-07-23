function addHuman() {
	var _publicKey = document.getElementById("publicKeyForAdd").value;
	var _privateKey = document.getElementById("privateKeyForAdd").value;
	var _name = document.getElementById("info_name").value;
	var _age = document.getElementById("info_age").value;
	var _address = document.getElementById("info_address").value;
	var image = document.getElementById("image").files[0];
	var _info ={
		name : _name,
		age : _age,
		address : _address
	};
	var jsonstring_info = JSON.stringify(_info);
	var _encodedHumanInfo = encodeHumanInfo(_publicKey, jsonstring_info);
	var _sign = makeSign(_privateKey);
	var reader = new FileReader();
	reader.onload = function(e) {
		var encryped_image = CryptoJS.AES.encrypt(e.target.result, _privateKey);
		$.post("/addHumanPage/addHuman", { publicKey: sha256(_publicKey), info: _encodedHumanInfo, sign: _sign, image: encryped_image.toString() }, function(data) {
			if(data == "Error") {
				$("#message1").text("An error occured.");
			}
			else {
				//var dataJSON = JSON.parse(data);
				console.log(data);
				var transaction_info = document.getElementsByClassName('alert alert-info');
            	for (var j = 0; j < transaction_info.length; j++) {
					transaction_info[j].style.visibility = 'visible';
				}
				$("#message1").html("Info Transaction hash: " + data.info);
				$("#message2").html("Sign Transaction hash: " + data.sign);
				$("#message3").html("Image Transaction hash: " + data.img);
			}
		});
	}
	reader.readAsDataURL(image);
}

function getHuman() {
	var _publicKey = document.getElementById("publicKeyForGet").value;
	var _privateKey = document.getElementById("privateKeyForGet").value;
	console.log("get information");

	$.get("/getHumanPage/getHuman?publicKey=" + sha256(_publicKey), function(data) {
		if (data[0] == "" && data[1] == "") {
			$("#message").text("An error occured.");
		}
		else {
			console.log(data[0]);
			var decode_info = decodeHumanInfo(_privateKey, data[0]);
			var decodeinfo = JSON.parse(decode_info);
			var info_name = decodeinfo.name;
			var info_age = decodeinfo.age;
			var info_address = decodeinfo.address;
			
			var id_info = document.getElementsByClassName('alert alert-info');
            for (var j = 0; j < id_info.length; j++) {
                id_info[j].style.visibility = 'visible';
			}
			var id_outline = document.getElementById('id-outline');
			id_outline.style.visibility ='visible';

			$("#info_name").html("Name : " + info_name);
			$("#info_age").html("Birth : " + info_age);
			$("#info_address").html("Address : " + info_address);
			
			var decrypted = CryptoJS.AES.decrypt(data[2], _privateKey).toString(CryptoJS.enc.Latin1);
			$("#testimage").attr("src", decrypted);
		}
	});
}

function verify() {
	var _publicKey = document.getElementById("publicKeyForGet").value;
	console.log("get verification");
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