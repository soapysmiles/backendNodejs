
var mysql = require('promise-mysql');
var info = require('../config');
const Valid = require('../modules/validator')
exports.isDuplicateUser = async (username) => {
    try{
        Valid.checkWord(username, 'username')
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
        
        return false
    }catch(err){
        throw err
    }
}

exports.getOne = async (username) => {
    try{
        Valid.checkWord(username, 'username')
        const connection = await mysql.createConnection(info.config);

        let sql = `SELECT * FROM user
                WHERE username = "${username}";`;
        const result = await connection.query(sql);
        
        if(result.length === 0) throw new Error('User does not exist')
        connection.end()
        return result[0]
    }catch(err){
        throw err
    }
}


exports.getOneByID = async (ID) => {
    try{
        Valid.checkID(ID, 'userID')
        const connection = await mysql.createConnection(info.config);

        let sql = `SELECT * FROM user
                WHERE ID = "${ID}";`;
        const result = await connection.query(sql);
        
        if(result.length === 0) throw new Error('User does not exist')
        connection.end()
        return result[0]
    }catch(err){
        throw err
    }
}