var nfc = require('nfc').nfc;
var fs = require('fs');
var http = require('http');

var n = new nfc();

var lastHex = false;
var lastTime = false;


Date.prototype.toYMD = function(){
	var t = new Date( this.getTime()-this.getTimezoneOffset()*60*1000 );
	var iso = t.toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/)
	return(iso[1]);
}
Date.prototype.toHIS = function(){
	var t = new Date( this.getTime()-this.getTimezoneOffset()*60*1000 );
	var iso = t.toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/)
	return(iso[2]);
}
Date.prototype.toYMDHIS = function(){
	var t = new Date( this.getTime()-this.getTimezoneOffset()*60*1000 );
	var iso = t.toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/)
	return(iso[1] + ' ' + iso[2]);
}


n.on('uid', function(uid) {
	
	var hex = toHex(uid['0']) + toHex(uid['1'])  + toHex(uid['2']) + toHex(uid['3']) ;
	
	//for( e in uid )
	//	console.log( e + ':'+ uid[e] );
	if( hex != lastHex || dateDiff( lastTime , new Date() ) > 2000 )
	{
		log( hex );
		sendEvent( hex );
		lastHex = hex;
		lastTime = new Date();
		console.log('UID:', hex);
	}
});

console.log('Démarrage NFC ...');
n.start();
console.log('OK');


function sendEvent( url )
{
	var options = {
	  hostname: 'localhost',
	  port: 8081,
	  path: '/'+url,
	  method: 'GET'
	};

	var req = http.request(options, function(res) {
	  /*
	  //console.log('STATUS: ' + res.statusCode);
	  //console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
		console.log('BODY: ' + chunk);
	  });
	  */
	});
	
	// write data to request body
	req.write('');
	req.end();
}


function toHex(d) {
    return  ("0"+(Number(d).toString(16))).slice(-2).toUpperCase()
}

function dateDiff( d1, d2 )
{
	return Math.abs( d2 - d1 );
}

function log( uid )
{
	var d = new Date();
	var logpath = '../log/nfc_'+d.toYMD()+'.log';

	var buffer = new Buffer( d.toYMDHIS()+' '+uid+"\n" );

	fs.open(logpath, 'a', function(err, fd) {
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
