var mysql = require('promise-mysql');
var info = require('../config');
var cfg = require("../config.js");
var jwt = require("jwt-simple");

var pass = require('../modules/password')
const Valid = require('../modules/validator')
var user = require('../modules/user')

exports.login = async(data) => {
    try{
        //Set DB connection
        const connection = await mysql.createConnection(info.config);

        Valid.checkWord(data.username, 'username')
        Valid.checkStringExists(data.password, 'password')

        const result = await user.getOne(data.username)

        const salt = result.passwordSalt;
        const hash = result.password;
        const valid = pass.comparePassword(data.password, salt, hash);

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