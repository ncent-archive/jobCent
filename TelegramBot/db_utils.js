const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('users.db');


const create_users_table = () => {
	let db = new sqlite3.Database('users.db');
	db.run('CREATE TABLE users (username text, publickey text, privatekey text)');
	db.close();
}


const insert_user = (username, publickey, privatekey) => {
	let db = new sqlite3.Database('users.db');
	db.run(`REPLACE INTO users(username, publickey, privatekey) VALUES(?,?,?)`, [username, publickey, privatekey]);
	db.close();
}


const get_user = (username) => {
	let db = new sqlite3.Database('users.db');
	let sql = `SELECT * FROM users WHERE username = ?`;
	return new Promise (function(resolve, reject){
		db.get(sql, [username], (err, row) => {
			resolve(row);
		})
	})
	.then(result => {
		return result
	})
}


function set_up_users_table() {
	let db = new sqlite3.Database('users.db');
		let sql = `SELECT count(*) FROM sqlite_master WHERE type="table" AND name="users"`;
		return new Promise (function(resolve, reject){
			db.get(sql, function(err, result) {
				resolve(result);
			})
		})
		.then(result => {
			if(result['count(*)'] === 0) {
				create_users_table()
			}
			db.close();
			return result
		})
}


module.exports = {
	create_users_table,
	insert_user,
	get_user,
	set_up_users_table
}