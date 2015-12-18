var canvas;

(function() {
    var socket = io.connect(window.location.href);
    var Insta = Insta || {};
    var counter = 0;
    Insta.App = {
        init: function() {
            socket.on('newimage', function (data) {
                document.getElementById('image').setAttribute("src", data.uri);
                document.getElementById('idimage').setAttribute("value", data.id);
            });
        }
    };

    canvas = document.getElementById('canvas');
    document.addEventListener('keydown', function(event) {
        var keyCode = ('which' in event) ? event.which : event.keyCode;
        //alert ("The Unicode key code is: " + keyCode);
        var idimage = document.getElementById('idimage');
        console.log(idimage.value);
        if (keyCode == 32) {
            socket.emit('event', { id: idimage.value, value: "oui" });
        }
        else {
            socket.emit('event', { id: idimage.value, value: "non" });
        }
    }, false);

    Insta.App.init();

})(this);