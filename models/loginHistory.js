var mysql = require('promise-mysql');
var info = require('../config');

//const Valid = require('../modules/validator')

exports.allLoginHistory = async(userID, pageNum, pageSize) => {
    
    try{
        pageNum = (pageNum-1) * pageSize
        const connection = await mysql.createConnection(info.config);
        console.log("12321")
        let sql = `SELECT * FROM loginHistory
        WHERE attemptedUserID = ${userID}
        LIMIT ${pageSize}
        OFFSET ${pageNum} ` 
        const val = await connection.query(sql);
        connection.end()
        return val
    }catch (error){
        console.log(error)
        return 'An Error has occured'
    }
}
exports.loginHistory = async(userID)=> {
    try{
        const connection = await mysql.createConnection(info.config);
        let sql = `SELECT * FROM loginHistory
        WHERE attemptedUserID = ${userID} 
        ORDER BY ID DESC LIMIT 1`
        const val = await connection.query(sql);
        connection.end()
        return val
    }catch (error){
        console.log(error)
        return 'An Error has occured'
    }
}