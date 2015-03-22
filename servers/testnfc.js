var nfc = require('nfc').nfc
, util = require('util')
, version = nfc.version()
, devices = nfc.scan()
;
console.log('version: ' + util.inspect(version, { depth: null }));
console.log('devices: ' + util.inspect(devices, { depth: null }));


/*
var nfc = require('nfc').nfc;
var n = new nfc();



n.on('uid', function(uid) {
    console.log('UID:', uid);
});

n.start();
*/
