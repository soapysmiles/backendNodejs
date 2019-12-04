var mysql = require('promise-mysql');
var info = require('../config');
var cfg = require("../config.js");
var jwt = require("jwt-simple");
const device = require('./deviceDoa');
var pass = require('../modules/password')
const Valid = require('../modules/validator')
var user = require('./userDoa')

exports.login = async(data, attempt) => {
    try{
        //Set DB connection
        const connection = await mysql.createConnection(info.config);

        Valid.checkWord(data.username, 'username')
        Valid.checkStringExists(data.password, 'password')

        const passData = await user.getPassword(data.username)

        const salt = passData.passwordSalt;
        const hash = passData.password;
        const valid = pass.comparePassword(data.password, salt, hash);

        const result = await user.getOne(data.username);

        this.addLoginHistory(result.ID, valid, attempt.ip, attempt.deviceType);
        
        var token;
        if(valid){
            var payload = {
                ID: result.ID,
            }

            token = jwt.encode(payload, cfg.jwt.jwtSecret)//Generate JWT token
        }else{
            throw {message: 'User does not exist', status: 400}
        }
        

        let sql = `
        UPDATE user
        SET jwt = "${token}"
        WHERE ID = ${payload.ID}`

        await connection.query(sql);
        
        connection.end()
        return {message:"Logged in successfully", token: token, user: result};
    }catch (error) {
        if(error.status === undefined || isNaN(error.status))
            error.status = 500;
        throw error;
    }
}



exports.addLoginHistory = async(userID, success, ip, deviceType) => {
    try{
        //Set DB connection
        const connection = await mysql.createConnection(info.config);
        Valid.checkID(userID, 'userID')
        Valid.checkStringExists(ip, 'IP')
        Valid.checkStringExists(deviceType, 'deviceType')
        const attemptDate = (new Date()).toISOString()

        let loginDate;
        (success) ? loginDate = attemptDate : loginDate = null;
        (success) ? success = 1 : success = 0;

        const dev =await  device.getDeviceID(deviceType)
        
        sql = `
        INSERT INTO loginHistory(
            attemptedUserID,
            attemptDate,
            succeded,
            IP,
            timeOfLogin,
            deviceTypeID    
        ) VALUES (
            ${userID},
            "${attemptDate}",
            ${success},
            "${ip}",
            "${loginDate}",
            ${dev.ID}
        );`
        await connection.query(sql);
        
        connection.end()
    }catch (error) {
        if(error.status === undefined || isNaN(error.status))
            error.status = 500;
        throw error;
    }
}