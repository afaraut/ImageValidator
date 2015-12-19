var socket = io.connect(window.location.href);

socket.on('newimage', function (data) {
    document.getElementById('image').setAttribute("src", data.uri);
    document.getElementById('idimage').setAttribute("value", data.id);
});

var canvas = document.getElementById('canvas');
document.addEventListener('keyup', function(event) {
    var keyCode = ('which' in event) ? event.which : event.keyCode;
    var idimage = document.getElementById('idimage');
    if (keyCode == 32) {
        socket.emit('event', { id: idimage.value, value: 1 });
    }
    else {
        socket.emit('event', { id: idimage.value, value: 0 });
    }
}, false);