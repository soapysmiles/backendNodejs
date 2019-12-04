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
        (device.length === 0) ? device = await this.addDevice(name) : device = device[0] 
        return device;
    }catch (error) {
        if(error.status === undefined || isNaN(error.status))
            error.status = 500;
        throw error;
    }
}

exports.getDeviceFromUserAgent = async(useragent) => {
    try{
        const types = ['isMobile', 'isDesktop'];
        for(let i = 0; i < Object.keys(useragent).length; i++){
            if(useragent[types[i]] == true) return types[i].slice(2,).toLowerCase()
        }
        return {message: 'unknown'}
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
        return result[0].ID;
    }catch (error) {
        if(error.status === undefined || isNaN(error.status))
            error.status = 500;
        throw error;
    }
}