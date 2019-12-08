var pass = require('../modules/password')
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

exports.getPassword = async (username) => {
    try{
        Valid.checkWord(username, 'username')
        const connection = await mysql.createConnection(info.config);

        let sql = `SELECT password, passwordSalt FROM user
                WHERE username = "${username}";`;
        const result = await connection.query(sql);
        
        if(result.length === 0) throw new Error('User does not exist')
        connection.end()
        return result[0]
    }catch(err){
        throw err
    }
}

exports.getPasswordByID = async (uID) => {
    try{
        Valid.checkID(uID, 'userID')
        const connection = await mysql.createConnection(info.config);

        let sql = `SELECT password, passwordSalt FROM user
                WHERE ID = "${uID}";`;
        const result = await connection.query(sql);
        
        if(result.length === 0) throw new Error('User does not exist')
        connection.end()
        return result[0]
    }catch(err){
        throw err
    }
}

exports.getJWT = async (ID) => {
    try{
        Valid.checkID(ID, 'ID')
        const connection = await mysql.createConnection(info.config);

        let sql = `SELECT ID, jwt FROM user
                WHERE ID = ${ID};`;
        const result = await connection.query(sql);
        
        if(result.length === 0) throw new Error('User does not exist')
        connection.end()
        return result[0]
    }catch(err){
        throw err
    }
}

exports.getOne = async (username) => {
    try{
        Valid.checkWord(username, 'username')
        const connection = await mysql.createConnection(info.config);

        let sql = `
            SELECT 
                ID,
                username,
                firstName,
                lastName,
                profileImageURL,
                email,
                about,
                countryID,
                birthDate,
                dateRegistered,
                active,
                deleted
            FROM user
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
       
        let sql = `
            SELECT 
                ID,
                username,
                firstName,
                lastName,
                profileImageURL,
                email,
                about,
                countryID,
                birthDate,
                dateRegistered,
                active,
                deleted
            FROM user
            WHERE ID = "${ID}";`;
        const result = await connection.query(sql);
        
        if(result.length === 0) throw new Error('User does not exist')
        connection.end()
        return result[0]
    }catch(err){
        throw err
    }
}

exports.updatePassword = async (uID, newPassword) => {
    try{
        Valid.checkWord(uID, 'userID')
        const connection = await mysql.createConnection(info.config);

        //Encrypt password
        const passHash = pass.encrypt(newPassword, null);

        await this.passwordChange_historyLog(uID);
        let sql = `
        UPDATE user
            SET password = "${passHash.hash}",
            passwordSalt = "${passHash.salt}"
            WHERE ID = "${uID}";`;
        await connection.query(sql);
        
        connection.end()
        return true
    }catch(err){
        throw err
    }
}

this.passwordChange_historyLog = async (uID) => {
    try{
        Valid.checkID(uID, 'userID')
        const connection = await mysql.createConnection(info.config);

        const curPassword = await this.getPasswordByID(uID);
        //Get current date, convert to mySQL format
        const dateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')

        let sql = `
        INSERT INTO passwordChangeHistory
        (   userID,
            oldPassword,
            oldPasswordSalt,
            dateChanged
        )VALUES(
            ${uID},
            "${curPassword.password}",
            "${curPassword.passwordSalt}",
            "${dateTime}"
        )`

        const result = await connection.query(sql);
        connection.end()
        return result.insertId
    }catch(err){
        throw err
    }
}