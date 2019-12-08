var pass = require('../modules/password')
var mysql = require('promise-mysql');
var info = require('../config');
const Valid = require('../modules/validator')

/**
 * @name isDuplicateUser checks for another user with same username
 * @author A.M
 * @param {string} username - username
 * @return {boolean} false if no user
 * @throws if user already exists
 */
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

/**
 * @name getPassword gets password salt and hash
 * @author A.M
 * @param {string} username - username
 * @throws if user does not exist
 * @return {object} password, passwordSalt
 */
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

/**
 * @name getPasswordByID gets password salt and hash
 * @author A.M
 * @param {INT} uID - userID
 * @throws if user does not exist
 * @return {object} password, passwordSalt
 */
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

/**
 * @name getJWT gets JWT token
 * @author A.M
 * @param {INT} ID - userID
 * @return {object} JWT data
 * @throws if user does not exist
 */
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

/**
 * @name getOne gets userdata
 * @author A.M
 * @param {string} username - username
 * @throws if user does not exist
 * @return {object} user data
 */
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

/**
 * @name getOneByID gets userdata
 * @author A.M
 * @param {INT} ID - user ID
 * @throws if user does not exist
 * @return {object} user data
 */
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

/**
 * @name updatePassword updates password
 * @author A.M
 * @param {INT} uID - userID
 * @param {string} newPassword - new password to insert
 * @return {bool} true if successful
 */
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

/**
 * @name passwordChange_historyLog logs a password change, preserving old password
 * @author A.M
 * @param {INT} uID - userID
 * @return {INT} inserID 
 */
this.passwordChange_historyLog = async (uID) => {
    try{
        Valid.checkID(uID, 'userID')
        const connection = await mysql.createConnection(info.config);

        const curPassword = await this.getPasswordByID(uID);//Get old password
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