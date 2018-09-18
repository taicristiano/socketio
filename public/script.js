$(document).ready(function(){
	var socket = io.connect();

	$('.chat_head').click(function() {
		$('.chat_body').slideToggle('slow');
	});
	$('.msg_head').click(function() {
		$('.msg_wrap').slideToggle('slow');
	});
	$('.close').click(function() {
		$('.msg_box').hide();
	});
	$('#setNick').submit(function(e) {
		e.preventDefault();
		console.log($('#nickName').val());
		if ($('#nickName').val() == null || $('#nickName').val() == "") {
			$('#nickErorr').html('Ban chua nhap tai khoan');
			alert("Ban chua nhap tai khoan");
		} else {
			socket.emit('new user', $('#nickName').val(), function(data) {
				if (data){
					console.log('status Ok');

					$('#nickWrap').hide();

					$('.chat_box').show();
				} else {
					$('#nickErorr').html('Tai khoan da duoc su dung. Vui long dien tai khoan khac');
				}
			});
			$('#nickName').val('');
			return false;
		}
	});

	function usernameClick() {
		$('.user').click(function() {
			console.log('Hello');
			console.log($(this).text()); // User name

			$('.msg_box').show();
			$('#box_name').html($(this).text());
			socket.emit('open-chatbox', $(this).text());
		});
	}
	usernameClick();

	socket.on('usernames', function(data) {
		console.log(data);
		var html = '';
		for (i = 0; i < data.length; i++) {
			html += '<div class="user" name="'+ data[i] +'">'+ data[i] +'</div>';
		}

		console.log(html);
		$('.chat_body').html(html);
		usernameClick();
	});
	socket.on('openbox', function(data) {
		console.log("Hot");
		$('.msg_box').show();
		$('#box_name').html(data.nick);
		// var text = '<div class="msg_box" style="right:290px; display:none">';
		// text += '<div class="msg_head">';
		// text += '<span id="box_name" name="'+ data.nick+'">'+ data.nick+'</span>';
		// text += '<div class="close">x</div>';
		// text += '</div>';
		// text += '<div class="msg_wrap">';
		// text += '<div class="msg_body">';
		// text += '<div class="msg_push"></div>';
		// text += '</div>';
		// text += '<div class="msg_footer"><textarea class="msg_input" rows="4"></textarea></div>';
		// text += '</div>';
		// text += '</div>';

		// $('body').append(text);

	});
	$('textarea').keypress(function(e) {
    	// e.preventDefault();
        if (e.keyCode == 13) {
        	var msg = $(this).val();
        	$(this).val('');
        	socket.emit('send message', msg, $('#box_name').text());
    	}
    });

	socket.on('new message', function(data) {
		console.log('Gui tu '+ data.nick);
		console.log('Gui toi '+ data.sendto);
		var className = 'msg_a';
		if (data.nick == $('#box_name').text()) {
			className = 'msg_b';
		}
		$('<div class="' + className + '"><b>' + data.nick + ': </b>' + data.msg + '</div>').insertBefore('.msg_push');
		$('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
	});
});
