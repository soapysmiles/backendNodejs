
var mysql = require('promise-mysql');
var info = require('../config');

exports.checkDuplicateUser = (username) => {
    try{
        const connection = await mysql.createConnection(info.config);

        const sql = `
            SELECT count(ID) FROM user
            WHERE username = "${username}";
        `
        connection.query(sql, (err, result, fields) => {
            if(err) throw err
            if(result.count > 0) throw new Error('User already exists')
        })
        connection.end()
        
    }catch(err){
        throw err
    }
}