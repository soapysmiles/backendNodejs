var mysql = require('promise-mysql');
var info = require('../config');

exports.getCountryByID = async(ID) => {
    try{
        //Set DB connection
        const connection = await mysql.createConnection(info.config);

        let sql = `
        SELECT * FROM countries
        WHERE ID = "${ID}";
        `
        let country = await connection.query(sql);
        country = country[0]
        return country;
    }catch (error) {
        if(error.status === undefined || isNaN(error.status))
            error.status = 500;
        throw error;
    }
}