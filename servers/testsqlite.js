var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../data/adheScan.sqlite');


db.run("CREATE TABLE IF NOT EXISTS `adherents` (`adh_id` INTEGER PRIMARY KEY,`nom` TEXT,`prenom` TEXT,`decharge` TEXT,`inscription` TEXT,`paiement` TEXT,`autorisation` TEXT,`nbr` TEXT,`ok` TEXT)");
db.run("CREATE TABLE IF NOT EXISTS `badges` (`badge_id` TEXT PRIMARY KEY,`adh_id` INTEGER,`insertDate` TEXT,`toSync` INTEGER)");
db.run("CREATE TABLE IF NOT EXISTS `logscans` (`log_id` INTEGER PRIMARY KEY ASC,`badge_id` INTEGER,`adh_id` INTEGER,`time` TEXT,`toSync` INTEGER)");



db.all("SELECT name FROM sqlite_master WHERE type='table';", function(err, rows) {
	console.log( rows );
	
	rows.forEach(function (row) {
		console.log(row.name);
	});
	//closeDb();
	
});

db.all("SELECT * FROM adherents;", function(err, rows) {
	console.log( rows );
	
	
});
