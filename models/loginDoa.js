var mysql = require('promise-mysql');
var info = require('../config');
var cfg = require("../config.js");
var jwt = require("jwt-simple");
const device = require('./deviceDoa');
var pass = require('../modules/password')
const Valid = require('../modules/validator')
var user = require('./userDoa')
var TFA = require('./twoFactorAuthDao')

/**
 * @name login
 * @param {object} data The data of the user's creditentials (username, password)
 * @param {object} attempt The data of the attempt (ip, deviceType)
 */
exports.login = async(data, attempt) => {
    try{
        //Set DB connection
        const connection = await mysql.createConnection(info.config);

        //Validate
        Valid.checkWord(data.username, 'username')
        Valid.checkStringExists(data.password, 'password')

        //Get original password
        const passData = await user.getPassword(data.username)
        const salt = passData.passwordSalt;
        const hash = passData.password;
        //Compare
        const valid = pass.comparePassword(data.password, salt, hash);
        //Get user based on username
        const result = await user.getOne(data.username);
        //Add login attempt
        await this.addLoginHistory(result.ID, valid, attempt.ip, attempt.deviceType, attempt.browser);
        
        var token;
        if(valid){
            var payload = {
                ID: result.ID,
            }

            token = jwt.encode(payload, cfg.jwt.jwtSecret)//Generate JWT token
        }else{
            throw {message: 'Username or password incorrect', status: 400}
        }
        
        //Add jwt to user table
        let sql = `
        UPDATE user
        SET jwt = "${token}"
        WHERE ID = ${payload.ID}`

        await connection.query(sql);
        
        const tfaA = await TFA.getTwoFactor(result.ID).catch((e)=> {e})
        const tfa = tfaA && tfaA.active
        connection.end()
        return {message:"Logged in successfully", token: token, user: result, tfa: tfa};
    }catch (error) {
        if(error.status === undefined || isNaN(error.status))
            error.status = 500;
        throw error;
    }
}


/**
 * @name addLoginHistory
 * @param {int} userID ID of attempted user login
 * @param {bool} success Logged in or not
 * @param {string} ip IP address of attempted login
 * @param {string} deviceType type of device
 */
exports.addLoginHistory = async(userID, success, ip, deviceType, browser) => {
    try{
        //Set DB connection
        const connection = await mysql.createConnection(info.config);

        //Validate
        Valid.checkID(userID, 'userID')
        Valid.checkStringExists(ip, 'IP')
        Valid.checkStringExists(deviceType, 'deviceType')
        Valid.checkStringExists(browser, 'browser')

        //Create date based on time right now
        const attemptDate = (new Date()).toISOString().slice(0, 19).replace('T', ' ')

        //Make login date dependant on success
        let loginDate;
        (success) ? loginDate = attemptDate : loginDate = undefined;

        //Set success to 1 or 0
        (success) ? success = 1 : success = 0;

        //Get deviceID
        const dev =await  device.getDeviceID(deviceType)

        //Get browser
        const brow = await device.getBrowserID(browser)
        sql = `
        INSERT INTO loginHistory(
            attemptedUserID,
            attemptDate,
            succeded,
            IP,
            ${(success) ? "timeOfLogin," : ""}
            deviceTypeID,
            browserID   
        ) VALUES (
            ${userID},
            "${attemptDate}",
            ${success},
            "${ip}",
            ${(success) ? `"${loginDate}",` : ""}
            ${dev},
            ${brow}
        );`
        await connection.query(sql);
        
        connection.end()

        return {message:"Added login history entry successfully", status: 200};
    }catch (error) {
        if(error.status === undefined || isNaN(error.status))
            error.status = 500;
        throw error;
    }
}