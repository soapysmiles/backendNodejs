var mysql = require('promise-mysql');
var info = require('../config');

exports.adminConsole = async() => {
    
}

exports.createTables = async(id) => {
    try{
        const connectionNoDB = await mysql.createConnection({host: info.config.host, user: info.config.user, password: info.config.password})
        let sql = 'CREATE DATABASE IF NOT EXISTS `'+ info.config.database + '`'

        await connectionNoDB.query(sql)

        const connection = await mysql.createConnection(info.config);

        sql = [
        `
        CREATE TABLE IF NOT EXISTS countries (
            ID INT NOT NULL AUTO_INCREMENT,
            name TEXT,
            abbreviation TEXT,
            PRIMARY KEY(ID)
        );
        `,`
        CREATE TABLE IF NOT EXISTS user (
            ID INT NOT NULL AUTO_INCREMENT,
            username TEXT,
            password TEXT,
            passwordSalt TEXT,
            jwt TEXT,
            firstName TEXT,
            lastName TEXT,
            profileImageURL TEXT,
            email TEXT,
            about TEXT,
            countryID INT,
            birthDate DATETIME,
            dateRegistered DATETIME,
            active BOOLEAN,
            deleted BOOLEAN,
            PRIMARY KEY(ID),
            CONSTRAINT FK_userCountry
                FOREIGN KEY (countryID) REFERENCES countries(ID)
        );
        `,`
        CREATE TABLE IF NOT EXISTS twoFactor (
            ID INT NOT NULL AUTO_INCREMENT,
            userID INT,
            secret TEXT,
            qrcode TEXT,
            active BOOLEAN,
            PRIMARY KEY(ID),
            CONSTRAINT FK_twoFactorUser
                FOREIGN KEY (userID) REFERENCES user(ID)
        );
        `,`
        CREATE TABLE IF NOT EXISTS deviceType(
            ID INT NOT NULL AUTO_INCREMENT,
            name TEXT,
            PRIMARY KEY(ID)
        );
        `,`
        CREATE TABLE IF NOT EXISTS browser(
            ID INT NOT NULL AUTO_INCREMENT,
            name TEXT,
            PRIMARY KEY(ID)
        );
        `,`
        CREATE TABLE IF NOT EXISTS loginHistory (
            ID INT NOT NULL AUTO_INCREMENT,
            attemptedUserID INT,
            attemptDate DATETIME,
            succeded BOOLEAN,
            IP TEXT,
            timeOfLogin DATETIME,
            loggedOutDate DATETIME,
            deviceTypeID INT,
            browserID INT,
            PRIMARY KEY(ID),
            CONSTRAINT FK_loginHistoryAttemptedUserID
                FOREIGN KEY (attemptedUserID) REFERENCES user(ID),
            CONSTRAINT FK_loginHistoryDeviceTypeID
                FOREIGN KEY (deviceTypeID) REFERENCES deviceType(ID),
            CONSTRAINT FK_loginHistoryBrowserID
                FOREIGN KEY (browserID) REFERENCES browser(ID)
        );
        `,`
        CREATE TABLE IF NOT EXISTS passwordReminder (
            ID INT NOT NULL AUTO_INCREMENT,
            userID INT,
            securityQuestion1 TEXT,
            securityAnswer1 TEXT,
            securityQuestion2 TEXT,
            securityAnswer2 TEXT,
            code TEXT,
            codeSalt TEXT,
            PRIMARY KEY(ID),
            CONSTRAINT FK_passwordReminderUserID
                FOREIGN KEY (userID) REFERENCES user(ID)
        );
        `,`
        CREATE TABLE IF NOT EXISTS passwordChangeHistory (
            ID INT NOT NULL AUTO_INCREMENT,
            userID INT,
            oldPassword TEXT,
            oldPasswordSalt TEXT,
            dateChanged DATETIME,
            PRIMARY KEY(ID),
            CONSTRAINT FK_passwordChangeHistoryUserID
                FOREIGN KEY (userID) REFERENCES user(ID)
        );
        `,`
        CREATE TABLE IF NOT EXISTS signupMethod (
            ID INT NOT NULL AUTO_INCREMENT,
            serviceProvider TEXT,
            URL TEXT,
            allowed BOOLEAN,
            PRIMARY KEY(ID)
        );
        `]
        for(let i = 0; i < sql.length; i++)await connection.query(sql[i]);
        

        return {message:"created successfully"};

    }catch (error){
        if(error.status === undefined || isNaN(error.status))
            error.status = 500;
        throw error;
    }
}