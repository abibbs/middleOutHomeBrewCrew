var socket = io();

$('#chatForm').hide();
$('#room').hide();
$('#name').focus();
$('#urlID').hide();

$('#chatForm').submit(function(){
	socket.emit('chat message', $('#m').val());
	$('#m').val('');
	return false;
});

$('#join').click(function() {
	var name = $('#name').val();
	if (name != '') {
		socket.emit('join', name);
		ready = true;
		$('#chatForm').show();
		$('#room').show();
		$('#m').focus();
		$('#urlID').show();
		$('#joinChat').hide();
	}
});

$('#name').keypress(function(e) {
	if (e.which === 13) {
		var name = $('#name').val();
		if (name != '') {
			socket.emit('join',name);
			ready = true;
		}
	}
});

socket.on('update', function(msg) {
	if (ready) {
		$('#messages').append($('<li>').text(msg));
	}
});

socket.on('update-people', function(people) {
	if (ready) {
		$('#people').empty();
		$.each(people, function(clientid,name) {
			$('#people').append($('<li>').text(name));
		});
	}
});

socket.on('chat message', function(who,msg){
	if (ready) {
		$('#messages').append($('<li>').text(who + ': ' + msg));
	}
});

$('#urlID').submit(function(){
	socket.emit('url submit', $('#url').val());
	$('#url').val('');
	return false;
});

socket.on('url submit', function(url){
	//set remote urls
	console.log('url submit:', url);
	$('.ifm').attr('src', 'https://www.youtube.com/embed/' + url + '?autoplay=1');
});