var speakeasy = require('speakeasy');
var QRCode = require('qrcode');
var mysql = require('promise-mysql');
var info = require('../config');
var valid = require('../modules/validator')

/**
 * @name authenticateTwoFactorAuth checks token is correct
 * @author A.M
 * @param {INT} uID - user ID
 * @param {string} token - optional (if(no TFA))
 * @returns {bool} false - if TFA is not activated
 * @returns {string} secret - if TFA activated
 * @throws If not successful
 */
exports.authenticateTwoFactorAuth = async (uID, token) => {
    const tfa = await this.getTwoFactor(uID);
    var secret = tfa.secret
    if(tfa.active == 0) return false
    var verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token
    });
    if(!verified) throw new Error('Not authenticated')
    return secret;
}

/**
 * @name twoFactorAuth checks secret is correct
 * @author A.M
 * @param {INT} uID - user ID
 * @param {string} secret - optional (if(no TFA))
 * @returns {bool} true - if TFA is not activated
 * @returns {bool} true - if TFA authenticated (secret correct)
 * @throws If not authenticated (secret incorrect)
 */
exports.twoFactorAuth = async (uID, secret) => {
    try{
        const twoFactor = await this.getTwoFactor(uID)
            .catch((e) => {
                if(e.message('Two factor not found')) return true
            })
            
        if(twoFactor.active == 0) return true
        if(twoFactor && twoFactor.secret == secret){
            return true
        }
        throw new Error('Not authenticated')
    }catch (error) {
        if(error.status === undefined || isNaN(error.status))
            error.status = 500;
        throw error;
    }
}

/**
 * @name activateTwoFactorAuth activates TFA
 * @author A.M
 * @param {INT} uID - user ID
 */
exports.activateTwoFactorAuth = async (uID) => {
    try{
        valid.checkID(uID, 'userID')

        var secret = speakeasy.generateSecret({length: 20});
        const qr = await this.generateQR(secret);

        await this.getTwoFactor(uID).catch(async(e) => {
            if(e.message === 'Two factor not found'){//Check if two factor already exists
                await this.addTwoFactor(uID, secret.base32, qr);
            }
        }).then(async(res) => {
            await this.updateTwoFactor(uID, secret.base32, qr);
        })

       
        return {message:"created successfully", secret: secret.base32, qrcode: qr};

    }catch (error) {
        if(error.status === undefined || isNaN(error.status))
            error.status = 500;
        throw error;
    }
}
/**
 * @name getTwoFactor gets TFA
 * @author A.M
 * @param {INT} uID - user ID
 */
exports.getTwoFactor = async (uID) =>{
    try{
        valid.checkID(uID, 'userID')
        //Set DB connection
        const connection = await mysql.createConnection(info.config);

        let sql = `
        SELECT * FROM twoFactor
        WHERE userID = ${uID}`;

        const result = await connection.query(sql);
        if(result.length === 0) throw new Error('Two factor not found')

        connection.end();
        return result[0];
    }catch (error) {
        if(error.status === undefined || isNaN(error.status))
            error.status = 500;
        throw error;
    }
}
/**
 * @name updateTwoFactor updates TFA
 * @author A.M
 * @param {INT} uID - user ID
 * @param {string} secret - secret of TFA
 * @param {string} qr - qrcode image of secret
 */
this.updateTwoFactor = async (uID, secret, qr) =>{
    try{
        valid.checkID(uID, 'userID')
        //Set DB connection
        const connection = await mysql.createConnection(info.config);

        let sql = `
        UPDATE twoFactor
        SET secret = "${secret}",
            qrcode = "${qr}",
            active = 1
        WHERE userID = ${uID};`;

        await connection.query(sql);


        connection.end();
        return true
    }catch(e){
        throw e
    }
    
}
/**
 * @name addTwoFactor adds TFA
 * @author A.M
 * @param {INT} uID - user ID
 * @param {string} secret - secret of TFA
 * @param {string} qr - qrcode image of secret
 */
this.addTwoFactor = async (uID, secret, qr) => {
    valid.checkID(uID, 'userID')
    //Set DB connection
    const connection = await mysql.createConnection(info.config);

    let sql = `
    INSERT INTO twoFactor
    (   secret,
        qrcode,
        active,
        userID
    )VALUES(
        "${secret}",
        "${qr}",
        1,
        ${uID}
    )`;

    await connection.query(sql);

    connection.end();
    return true
}

/**
 * @name generateQR generates QRcode based on secret TFA
 * @author A.M
 * @param {string} secret - secret of TFA
 * @returns {string} qr - qrcode image of secret
 */
this.generateQR = async (secret) => {
    try{
        let qr =await QRCode.toDataURL(secret.otpauth_url)
        return qr;
    }catch(e){
        throw e
    }
}

/**
 * @name deactivateTwoFactorAuth deactivates TFA
 * @author A.M
 * @param {INT} uID - user ID
 */
exports.deactivateTwoFactorAuth = async (uID) => {
    try{
        valid.checkID(uID, 'userID')

        //Set DB connection
        const connection = await mysql.createConnection(info.config);

        let sql = `
        UPDATE twoFactor
        SET secret = "",
            qrcode = "",
            active = 0
        WHERE userID = ${uID};`;

        await connection.query(sql);

        connection.end();
        return {message:"deactivated successfully"};

    }catch (error) {
        if(error.status === undefined || isNaN(error.status))
            error.status = 500;
        throw error;
    }
}

