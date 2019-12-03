var mysql = require('promise-mysql');
var bcrypt = require('bcrypt');
var info = require('../config');


const Valid = require('../modules/validator')
const valid = new Valid()

exports.newUser = async(data) => {
    try{
        const connection = await mysql.createConnection(info.config);
        const words = [data.username,data.fName,data.lName,data.about]
        for(let i = 0; i < words.length; i++) valid.checkWord(words[i], i)//Check words are valid
        

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
                
            )`

        connection.end()
        return {message:"created successfully"};
    }catch(err){
        console.log(err);
        ctx.throw(500, 'An Error has occured');
    }
}

