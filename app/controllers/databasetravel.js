//=============================Create table==================================
exports.createDataTravel= function (tbl) {

	var db = Ti.Database.open('DataPoint');
	switch(tbl) {
		case 'user':
			db.execute('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, pass TEXT, sex TEXT, birthday TEXT)');
			break;
		case 'route':
			db.execute('CREATE TABLE IF NOT EXISTS route (id INTEGER PRIMARY KEY AUTOINCREMENT, idUser INTEGER, placeStart TEXT, placeStop TEXT)');
			break;
		case 'location':
			
			db.execute('CREATE TABLE IF NOT EXISTS location (id INTEGER PRIMARY KEY AUTOINCREMENT, instruction TEXT, pointX TEXT, pointY TEXT)');
			db.execute('DELETE FROM location');
			break;
		case 'icon':
			db.execute('CREATE TABLE IF NOT EXISTS icon (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, url TEXT, idCateIcon INTEGER)');
			break;
		case 'cateicon':
			db.execute('CREATE TABLE IF NOT EXISTS cateicon (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT, type TEXT)')
			break;
		default:
			break;
	}

	db.close();
}

//==============================Inster data==================================
function insertDataTravel(obj, tbl) {

	var db = Ti.Database.open('DataPoint');
	switch(tbl) {
		case 'user':
			db.execute('INSERT INTO user (username,pass,sex,birthday) VALUES(?,?,?)', obj);
			break;
		case 'route':
			db.execute('INSERT INTO route (idUser, placeStart, placeStop) VALUES(?,?,?)', obj);
			break;
		case 'location':
			db.execute('INSERT INTO location (instruction,pointX,pointY) VALUES(?,?,?)', obj);
			break;
		case 'icon':
			db.execute('INSERT INTO icon (name, url, idCateIcon) VALUES(?,?,?)', obj);
			break;
		case 'cateicon':
			db.execute('INSERT INTO cateicon (name, type) VALUES(?,?)', obj);
			break;
		default:
			break;
	}
	db.close();
}

exports.insertDataTravel = insertDataTravel;
//==============================Action table user==================================
function reviewDataTravelGetUser(obj) {
	var id = null;
	var db = Ti.Database.open('DataPoint');
	var rows = db.execute('SELECT id, username, pass FROM user WHERE username=' + obj.username + ' and pass=' + obj.pass);
	while (rows.isValidRow()) {
		id = rows.fieldByName('id');
		rows.next();
	}
	rows.close
	db.close();
	return id;
}

//==============================Action table route==================================

function reviewDataTableGetAllRoute(obj) {
	var route = [];
	var db = Ti.Database.open('DataPoint');
	var rows = db.execute('SELECT placeStart, placeStop FROM route WHERE idUser=' + obj);
	while (rows.isValidRow()) {
		route.push(rows.fieldByName('placesStart') + "--->" + rows.fieldByName('placeStop'));
		rows.next();
	}
	rows.close();
	db.close();
	return route;
}

function reviewDataTableGetId(obj) {
	var id = null;
	var db = Ti.Database.open('DataPoint');
	var row = db.execute('Select id FROM route WHERE placeStart=' + obj.placeStart + 'and placeStop=' + obj.placeStop);
	if (row.rowCount != 0) {
		return row.fieldByName('id');
	}
	return id;
}

//==============================Action table location==================================
function reviewDataTableGetAllLocation() {
	var db = Ti.Database.open('DataPoint');
	var rows = db.execute('SELECT instruction, pointX , pointY FROM location');
	var location =[];
	while (rows.isValidRow()) {
		location.push({
			instruction:rows.fieldByName('instruction'),
			pointX:rows.fieldByName('pointX'),
			pointY:rows.fieldByName('pointY')
		});
		rows.next();
	}
	rows.close();
	db.close();
	return location;
}

exports.reviewDataTableGetAllLocation = reviewDataTableGetAllLocation;
//==============================Test================================================
function reviewDataTableGetIntruction(obj) {
	var db = Ti.Database.open('DataPoint');
	var row = db.execute('SELECT instruction FROM location WHERE pointX=' + obj.pointX + ' and pointY=' + obj.pointY);
	var instruction="null";
	if(row.rowCount!=0) {
		instruction=row.fieldByName('instruction');
	}
	row.close();
	db.close();
	return instruction;
}
exports.reviewDataTableGetIntruction = reviewDataTableGetIntruction;
//==============================Delete table==================================
function deletetable() {
	var db = Ti.Database.open('DataPoint');
	db.execute('DELETE FROM points');
	db.close();
}

//==============================Play mp3 url==================================
function play(url) {
	var audioPlayer = Titanium.Media.createAudioPlayer({
		url : url,
		allowBackground : true,
		volume:1

	});
	if (audioPlayer.playing || audioPlayer.paused) {
		audioPlayer.stop();
		if (Ti.Platform.name === 'android') {
			audioPlayer.release();
		}
	} else {
		audioPlayer.start();
	}
}
exports.play=play;