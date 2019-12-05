var mysql = require('promise-mysql');
var info = require('../config');

//const Valid = require('../modules/validator')

exports.allLoginHistory = async(userID) => {
    
    try{
        console.log('Comming here123123')
        const connection = await mysql.createConnection(info.config);
        let sql = `SELECT * FROM loginHistory
        WHERE attemptedUserID = ${userID}
        LIMIT 10 OFFSET 10`
        const tobe = await connection.query(sql);
        connection.end()
        return {message:"created successfully", data: tobe}
    }catch (error){

        return 'An Error has occured'
    }
}
exports.loginHistory = async(userID, ID)=> {
    try{
        const connection = await mysql.createConnection(info.config);
        let sql = 'SELECT * FROM loginHistory WHERE attemptedUserID = "${userID}" AND ID = "${ID}" LIMIT 10 OFFSET 10'
        const tobe = await connection.query(sql);
        connection.end()
        return {message:"created successfully", tobe}
    }catch (error){

        return 'An Error has occured'
    }
}