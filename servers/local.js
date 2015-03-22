var http = require('http');
var fs = require('fs');
// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('../client/index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});
// Chargement de socket.io
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket, pseudo) {
    // Quand on client se connecte, on lui envoie un message
    socket.emit('proto', 'OK');
    
    socket.on('proto', function(request) {
		console.log( "receive [proto] : "+request);
		if( request == 'test' )
			socket.emit('proto', 'OK');
    });
    
    socket.on('log', function(request) {
		console.log( "receive [log] : "+request);
		socket.broadcast.emit( 'log', request );
	});
    
    
    socket.on('message', function (message) {
        // On récupère le pseudo de celui qui a cliqué dans les variables de session
        socket.get('pseudo', function (error, pseudo) {
            console.log(pseudo + ' me parle ! Il me dit : ' + message);
        });
    }); 
});
server.listen(8080);


var server2 = http.createServer(function(req, res) {
    //console.log( req );
    var id = req.url.substring(1,20 );
    io.emit('log',id);
    res.end('OK : '+id);
});
server2.listen( 8081 );
