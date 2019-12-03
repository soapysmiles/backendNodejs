var mysql = require('promise-mysql');
var bcrypt = require('bcrypt');
var info = require('../config');

var Pass = require('../modules/password')
const Valid = require('../modules/validator')
var user = require('../modules/user')


exports.register = async(ctx, data) => {
    const pass = new Pass()
    try{
        //Check if user exists
        await user.isDuplicateUser(data.username).catch((err) => {
            throw {message: err.message, status:409};
        })

        //Set DB connection
        const connection = await mysql.createConnection(info.config);

        //Check words match requirements
        const words = [
            {data: data.username, name: 'username'},
            {data: data.fName, name: 'first name'},
            {data: data.lName, name: 'last name'},
            {data: data.about, name: 'about'}
        ]
        for(let i = 0; i < words.length; i++) {
            try{
                Valid.checkWord(words[i].data, words[i].name)
            }catch(err){
                throw {message: err.message, status:400};
            }
        }

        //Check email
        try{
            Valid.checkEmail(data.email)
        }catch(err){
            throw {message: err.message, status:400};
        }
        

        //Encrypt password
        const passHash = pass.encrypt(data.password, null);

        //Convert text date to mySQL date
        const birthDate = Valid.convertDate(data.birthDate).toISOString().slice(0, 19).replace('T', ' ')

        //Get current date, convert to mySQL format
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
            );`

        await connection.query(sql);

        connection.end()
        return {message:"created successfully"};
    }catch (error) {
        if(error.status === undefined || isNaN(error.status))
            error.status = 500;
        throw error;
    }
}

