var speakeasy = require('speakeasy');
var QRCode = require('qrcode');
var mysql = require('promise-mysql');
var info = require('../config');
var valid = require('../modules/validator')

exports.authenticateTwoFactorAuth = async () => {

}

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

this.generateQR = async (secret) => {
    try{
        let qr =await QRCode.toDataURL(secret.otpauth_url)
        return qr;
    }catch(e){
        throw e
    }
}

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

