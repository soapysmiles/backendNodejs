var mysql = require('promise-mysql');
var bcrypt = require('bcrypt');
var info = require('../config');

var Pass = require('../modules/password')
const Valid = require('../modules/validator')
var user = require('../modules/user')


function convertDate(dateString){
    var parts = dateString.split('-');
    var result = new Date(parts[0], parts[1] - 1, parts[2]); 
    return result;
}


exports.register = async(ctx, data) => {
    const valid = new Valid()
    const pass = new Pass()
    try{
        await user.isDuplicateUser(data.username).catch((err) => {
            throw {message: err.message, status:409};
        })//Check if user exists

        const connection = await mysql.createConnection(info.config);
        const words = [data.username,data.fName,data.lName,data.about]
        for(let i = 0; i < words.length; i++) valid.checkWord(words[i], i)//Check words are valid
        const passHash = pass.encrypt(data.password, null);
        const birthDate = convertDate(data.birthDate).toISOString().slice(0, 19).replace('T', ' ')
        const regDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
        const sql = `INSERT INTO user(
            username,
            password,
            passwordSalt,
            firstName,
            lastName,
            email,
            about,
            countryID,
            birthDate,
            dateRegistered,
            active,
            deleted) VALUES (
                "${data.username}",
                "${passHash.hash}",
                "${passHash.salt}",
                "${data.fName}",
                "${data.lName}",
                "${data.email}",
                "${data.about}",
                "${data.countryID}",
                "${birthDate}",
                "${regDateTime}",
                1,
                0
            )`

            await connection.query(sql);

        connection.end()
        ctx.response.status = 201;
        return {message:"created successfully"};
    }catch (error) {
        if(error.status === undefined)
            error.status = 500;
        throw error;
    }
}

