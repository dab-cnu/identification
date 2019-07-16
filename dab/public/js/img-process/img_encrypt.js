$(function(){
	/* Step 2 */
	$('#step2 .button').click(function(){
		$(this).parent().find('input').click();
		// 인풋 이벤트 확인
	});

	var file = null;
	$('#step2').on('change', '#encrypt-input', function(e){
		// 파일이 있는지
		if(e.target.files.length!=1){
			alert('Please select a file to encrypt!');
			return false;
		}

		file = e.target.files[0];
		console.log("encrypt-input file : ", file);
		if(file.size > 1024*1024){
			alert('Please choose files smaller than 1mb, otherwise you may crash your browser.');
			return;
		}

	});
	// 파일에 쓰일 패스워드 입력
	$('a.button.process').click(function(){

		var input = $(this).parent().find('input[type=password]'),
			a = $('#test');
			console.log(a);
			password = input.val();
			console.log(password);
		input.val('');
		if(password.length<5){
			alert('Please choose a longer password!');
			return;
		}

		var reader = new FileReader();

			// 암호화
			reader.onload = function(e){
				var encrypted = CryptoJS.AES.encrypt(e.target.result, password);
				console.log(encrypted);
				// encrypted를 ipfs로 넣어야함
				$("#test").attr("value", encrypted);				
				
				console.log("encdrypted file : ", encrypted);
				// 이걸 가져가면됨
				
			};
			reader.readAsDataURL(file);
		
	
	});


});
