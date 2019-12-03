
var mysql = require('promise-mysql');
var info = require('../config');

exports.isDuplicateUser = async (username) => {
    try{
        let found = false
        const connection = await mysql.createConnection(info.config);

        const sql = `
            SELECT count(ID) FROM user
            WHERE username = "${username}";`
        const result = await connection.query(sql)
            
        Object.keys(result).forEach(function(key) {
            var row = result[key]
            if (row['count(ID)'] != 0) throw new Error('User already exists')
                
        }); 
        connection.end()
        
        return found
    }catch(err){
        throw err
    }
}