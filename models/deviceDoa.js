var mysql = require('promise-mysql');
var info = require('../config');

exports.getDeviceID = async(name) => {
    try{
        //Set DB connection
        const connection = await mysql.createConnection(info.config);

        let sql = `
        SELECT ID FROM deviceType
        WHERE name = "${name}";
        `
        let device = await connection.query(sql);
        //If device doesn't exist, create it
        (device.length === 0) ? device = await this.addDevice(name) : device = device[0].ID
        return device;
    }catch (error) {
        if(error.status === undefined || isNaN(error.status))
            error.status = 500;
        throw error;
    }
}

exports.getDeviceFromUserAgent = async(useragent) => {
    try{
        const types = ['isMobile', 'isDesktop', 'isTablet'];
        //Iterate through types, assert which
        for(let i = 0; i < Object.keys(useragent).length; i++){
            if(useragent[types[i]] === true) return types[i].slice(2,).toLowerCase()
        }
        
        return 'unknown'
    }catch (error) {
        if(error.status === undefined || isNaN(error.status))
            error.status = 500;
        throw error;
    }
}

exports.addDevice = async(name) => {
    try{
        //Set DB connection
        const connection = await mysql.createConnection(info.config);

        let sql = `
        INSERT INTO deviceType
        (name) VALUES("${name}");
        `
        const result = await connection.query(sql);
        return result.insertId;
    }catch (error) {
        if(error.status === undefined || isNaN(error.status))
            error.status = 500;
        throw error;
    }
}

exports.addBrowser = async(name) => {
    try{
        //Set DB connection
        const connection = await mysql.createConnection(info.config);

        let sql = `
        INSERT INTO browser
        (name) VALUES("${name.toLowerCase()}");
        `
        const result = await connection.query(sql);
        return result.insertId;
    }catch (error) {
        if(error.status === undefined || isNaN(error.status))
            error.status = 500;
        throw error;
    }
}

exports.getBrowserID = async(name) => {
    try{
        //Set DB connection
        const connection = await mysql.createConnection(info.config);

        let sql = `
        SELECT ID FROM browser
        WHERE name = "${name.toLowerCase()}";
        `

        let browser = await connection.query(sql);
        //If browser doesn't exist, create it
        (browser.length === 0) ? browser = await this.addBrowser(name) : browser = browser[0].ID
        return browser;
    }catch (error) {
        if(error.status === undefined || isNaN(error.status))
            error.status = 500;
        throw error;
    }
}