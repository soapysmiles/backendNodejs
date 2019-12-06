var mysql = require('promise-mysql');
var info = require('../config');
const fs = require('fs-extra')
const mime = require('mime-types')
var pass = require('../modules/password')
const Valid = require('../modules/validator')
var user = require('./userDoa')


exports.register = async(ctx, data, image) => {
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

        let sql = `INSERT INTO user(
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

        const result = await connection.query(sql);
        console.log(result)
        if(image) await this.addPhoto(image.path, image.type, result.insertId).catch((e) => e)//Catch as image is optional
        
        connection.end()
        return {message:"created successfully"};
    }catch (error) {
        if(error.status === undefined || isNaN(error.status))
            error.status = 500;
        throw error;
    }
}

exports.addPhoto = async (path, type, userID) => {
    try{
        console.log(path)
        try{
            Valid.checkID(userID, 'userID')
            Valid.checkStringExists(path, 'path')
            Valid.checkStringExists(type, 'type')
            if(!type.match(/.(jpg|jpeg|png|gif)$/i)) throw new Error('Not an image')
        }catch(err){
            throw {message: err.message, status:400};
        }

        const connection = await mysql.createConnection(info.config);
        
        const extension = mime.extension(type)
    
        let sql = `SELECT count(ID) as records FROM user
            WHERE ID = ${userID}`
        
        const result = await connection.query(sql);
        if(result.records === 0){throw {message: 'User does not exist', status: 400}}    
        
        const picPath = `user/${userID}/avatar.${extension}`
        
        await fs.copy(path, `public/${picPath}`)
    
        sql = `UPDATE user 
            SET profileImageURL = "${picPath}"
            WHERE ID = ${userID}`
        await connection.query(sql)
    
        return true
    }catch (error) {
        if(error.status === undefined || isNaN(error.status))
            error.status = 500;
        throw error;
    }
   
}