$(function(){
    
	/* Step 2 */
	$('#step2 .button').click(function(){
		$(this).parent().find('input').click();
		// 인풋 이벤트 확인
	});

	var file = null;
	
	$('#step2').on('change', '#decrypt-input', function(e){

        file = e.target.value;
	});
	/* Step 3 */

	// 파일에 쓰일 패스워드 입력
	$('a.button.process').click(function(){

		var input = $(this).parent().find('input[type=password]'),

		password = input.val();
		console.log(password);
		input.val('');
		if(password.length<5){
			alert('Please choose a longer password!');
			return;
		}

		// Decrypt it!

		var decrypted = CryptoJS.AES.decrypt(file, password)
										.toString(CryptoJS.enc.Latin1);
        if(!/^data:/.test(decrypted)){
			alert("Invalid pass phrase or file! Please try again.");
			return false;
		}
        console.log("decrypted: ",decrypted);
		$("#img").attr("src", decrypted);//이미지 소스 넣기

	});


});
