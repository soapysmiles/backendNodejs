var mysql = require('promise-mysql');
var info = require('../config');

/**
 * @name getDeviceID - gets device by name
 * @author A.M
 * @param {string} name - name of device
 * @returns {Object} of device data
 */
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

/**
 * @name getDeviceID - gets device name by ID
 * @author A.M
 * @param {INT} ID - ID of device
 * @returns {string} of device name
 */
exports.getDeviceName = async(ID) => {
    try{
        //Set DB connection
        const connection = await mysql.createConnection(info.config);

        let sql = `
        SELECT name FROM deviceType
        WHERE ID = ${ID};
        `

        let deviceType = await connection.query(sql);
        name = deviceType[0].name
        return name;
    }catch (error) {
        if(error.status === undefined || isNaN(error.status))
            error.status = 500;
        throw error;
    }
}

/**
 * @name getDeviceFromUserAgent - gets device name from user agent
 * @author A.M
 * @param {useragent Object} useragent
 * @returns {string} device name
 */
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
/**
 * @name addDevice - adds device based on device name
 * @author A.M
 * @param {string} name
 * @returns {INT} insert ID
 */
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
/**
 * @name addBrowser - adds browser based on browser name
 * @author A.M
 * @param {string} name
 * @returns {INT} insert ID
 */
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
/**
 * @name getBrowserName - gets browser name by ID
 * @author A.M
 * @param {INT} ID - ID of browser
 * @returns {string} of browser name
 */
exports.getBrowserName = async(ID) => {
    try{
        //Set DB connection
        const connection = await mysql.createConnection(info.config);

        let sql = `
        SELECT name FROM browser
        WHERE ID = ${ID};
        `

        let browser = await connection.query(sql);
        name = browser[0].name
        return name;
    }catch (error) {
        if(error.status === undefined || isNaN(error.status))
            error.status = 500;
        throw error;
    }
}
/**
 * @name getBrowserID - gets browser ID by name
 * @author A.M
 * @param {string} name - name of browser
 * @returns {object} of browser data
 */
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