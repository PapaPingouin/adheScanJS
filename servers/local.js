var http = require('http');
var fs = require('fs');



Date.prototype.toYMD = function()
{
	var t = new Date( this.getTime()-this.getTimezoneOffset()*60*1000 );
	var iso = t.toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/)
	return(iso[1]);
}
Date.prototype.toHIS = function()
{
	var t = new Date( this.getTime()-this.getTimezoneOffset()*60*1000 );
	var iso = t.toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/)
	return(iso[2]);
}
Date.prototype.toYMDHIS = function()
{
	var t = new Date( this.getTime()-this.getTimezoneOffset()*60*1000 );
	var iso = t.toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/)
	return(iso[1] + ' ' + iso[2]);
}




// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
	//console.log( req );
    fs.readFile('../client'+req.url, 'utf-8', function(error, content) {
        //res.writeHead(200, {"Content-Type": "text/html"});
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
    
    socket.on('push', function (request) {
        // On récupère le pseudo de celui qui a cliqué dans les variables de session
        //console.log( "push : "+request);
        writeData( request );
        for( e in request )
			console.log( 'push '+e+' : '+request[e] );
    }); 
    
    socket.on('save', function (request) { // save la BDD complete
        // On récupère le pseudo de celui qui a cliqué dans les variables de session
        //console.log( "push : "+request);
        saveBdd( request );
        console.log( "Save BDD OK" );
    }); 
});
server.listen(8080);


var server2 = http.createServer(function(req, res) {
    //console.log( req );
    var id = req.url.substring(1,20 );
    if( id.match( /([0-9A-F]+)/ ) ) // pour éviter les requetes hors number (ex : favicon !)
    {
		io.emit('log',id);
		res.end('OK : '+id);
		console.log( 'transmit '+id );
	} 
});
server2.listen( 8081 );



function writeData( data )
{
	var d = new Date();
	var datafile = '../data/data.list';

	var buffer = new Buffer( JSON.stringify( data )+"\n" );

	fs.open(datafile, 'a', function(err, fd) {
		if (err) {
			throw 'error opening file: ' + err;
		}

		fs.write(fd, buffer, 0, buffer.length, null, function(err) {
			if (err) throw 'error writing file: ' + err;
			fs.close(fd, function() {
				//console.log('file written');
			})
		});
	});
}


function saveBdd( data )
{
	var d = new Date();
	var datafile = '../client/data.js';

	var buffer = new Buffer( "var listingSrc = "+JSON.stringify( data )+";" );

	fs.open(datafile, 'w', function(err, fd) {
		if (err) {
			throw 'error opening file: ' + err;
		}

		fs.write(fd, buffer, 0, buffer.length, null, function(err) {
			if (err) throw 'error writing file: ' + err;
			fs.close(fd, function() {
				//console.log('file written');
			})
		});
	});
}
