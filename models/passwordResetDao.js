var mysql = require('promise-mysql');
var info = require('../config');
var jwt = require("jwt-simple");
const Valid = require('../modules/validator')
const password = require('../modules/password')
const user = require('./userDao');

/**
 * @name getQuestionsAnswers
 * @param {int} uID the user ID
 * @throws if no questions found
 */
this.getQuestionsAnswers = async (uID) => {
    try{
        Valid.checkID(uID, 'userID')
        const connection = await mysql.createConnection(info.config);

        let sql = `SELECT * FROM passwordReminder
                WHERE userID = "${uID}";`;
        const result = await connection.query(sql);
        
        if(result.length === 0) throw new Error('No questions found')
        connection.end()
        return result[0]
    }catch(err){
        throw err
    }
}

/**
 * @name checkAnswers
 * @param {int} uID the user ID
 * @param {Object} data The data object with questions and answers to set
 * @throws if answers are incorrect
 * @returns true if answers are correct
 */
exports.checkAnswers = async (uID,data) => {
    try{
        Valid.checkID(uID, 'userID')
        Valid.checkWord(data.answer1, 'answer1');
        Valid.checkWord(data.answer2, 'answer2');

        const result = await this.getQuestionsAnswers(uID)
            .catch((e) => {
                throw e
            })
        
        if(result.securityAnswer1 == data.answer1 && result.securityAnswer2 == data.answer2) return await this.setCode(uID);

        throw new Error('Answers incorrect')
    }catch(err){
        throw err
    }
}

this.clearCode = async(uID) => {
    try{
        Valid.checkID(uID, 'userID')
        const connection = await mysql.createConnection(info.config);

        let sql = `UPDATE passwordReminder
            SET code = "",
            codeSalt = ""
            WHERE userID = "${uID}";`;
        await connection.query(sql);
        
        connection.end()
        return true
    }catch(err){
        throw err
    }
}

this.setCode = async(uID) => {
    try{
        Valid.checkID(uID, 'userID')
        const connection = await mysql.createConnection(info.config);

        const code = password.encrypt(toString(Math.floor(Math.random() * 1000)), null);

        let sql = `UPDATE passwordReminder
            SET code = "${code.hash}",
            codeSalt = "${code.salt}"
            WHERE userID = ${uID};`;
        await connection.query(sql);
        
        connection.end()
        return code
    }catch(err){
        throw err
    }
}


this.getCode = async(uID) => {
    try{
        Valid.checkID(uID, 'userID')
        const connection = await mysql.createConnection(info.config);


        let sql = `SELECT code, codeSalt FROM passwordReminder
            WHERE userID = ${uID};`;
        const result = await connection.query(sql);
        
        connection.end()
        return result[0];
    }catch(err){
        throw err
    }
}

exports.passwordReset = async(uID, data) => {
    try{
        Valid.checkID(uID, 'userID')
        Valid.checkStringExists(data.newPassword, 'new password');
        Valid.checkStringExists(data.codeHash, 'codeHash');
        Valid.checkStringExists(data.codeSalt, 'codeSalt');
        
        const connection = await mysql.createConnection(info.config);

        const code = await this.getCode(uID).catch((e) => {throw e})

        if(code.code == data.codeHash && code.codeSalt == data.codeSalt){
            await user.updatePassword(uID, data.newPassword).catch((e)=>{throw e})
            await this.clearCode(uID)
        }
        
        connection.end()
        return true
    }catch(err){
        throw err
    }
}

/**
 * @name getQuestions
 * @param {int} uID the user ID
 * @throws if no questions found
 */
exports.getQuestions = async (uID) => {
    try{
        Valid.checkID(uID, 'userID')
        const connection = await mysql.createConnection(info.config);

        let sql = `SELECT securityQuestion1, securityQuestion2, ID, userID FROM passwordReminder
                WHERE userID = "${uID}";`;
        const result = await connection.query(sql);
        
        if(result.length === 0) throw new Error('No questions found')
        connection.end()
        return result[0]
    }catch(err){
        throw err
    }
}


/**
 * @name setQuestionsAnswers
 * Sets questions and answers based on user ID
 * @param {int} uID The userID
 * @param {Object} data The data object with questions and answers to set
 */
exports.setQuestionsAnswers = async (uID, data) => {
    try{
        Valid.checkID(uID, 'userID')
        Valid.checkWord(data.question1, 'question1');
        Valid.checkWord(data.question2, 'question2');
        Valid.checkWord(data.answer1, 'answer1');
        Valid.checkWord(data.answer2, 'answer2');
        
        await this.getQuestionsAnswers(uID)
            .catch(async (e) => {
            if(e.message = 'No questions found'){
                await this.insertQuestions(uID, data)
            }
        }).then(async (qa) => {
            await this.updateQuestions(qa.ID, data)
        })

        
        return true
    }catch(err){
        throw err
    }
}

/**
 * @name updateQuestions
 * @param qID question ID
 * @param data the data to update with
 */
this.updateQuestions = async (qID, data) => {
    try{
        Valid.checkID(qID, 'questionID')
        Valid.checkWord(data.question1, 'question1');
        Valid.checkWord(data.question2, 'question2');
        Valid.checkWord(data.answer1, 'answer1');
        Valid.checkWord(data.answer2, 'answer2');

        const connection = await mysql.createConnection(info.config);

        let sql = `UPDATE passwordReminder
            SET securityQuestion1 = "${data.question1}",
            securityQuestion2 = "${data.question2}",
            securityAnswer1 = "${data.answer1}",
            securityAnswer2 = "${data.answer2}"
            WHERE ID = ${qID};`;
        const result = await connection.query(sql);
        
        connection.end()
        return true
    }catch(err){
        throw err
    }
}
/**
 * @name insertQuestions
 * @param uID user ID
 * @param data the data to insert with
 */
this.insertQuestions = async (uID, data) => {
    Valid.checkID(uID, 'userID')
    Valid.checkWord(data.question1, 'question1');
    Valid.checkWord(data.question2, 'question2');
    Valid.checkWord(data.answer1, 'answer1');
    Valid.checkWord(data.answer2, 'answer2');

    const connection = await mysql.createConnection(info.config);

    let sql = `
    INSERT INTO passwordReminder 
        (
            securityQuestion1,
            securityQuestion2,
            securityAnswer1,
            securityAnswer2,
            userID
        )
    VALUES(
        "${data.question1}",
        "${data.question2}",
        "${data.answer1}",
        "${data.answer2}",
        ${uID}
        );`;
    await connection.query(sql);
    
    connection.end()
    return true
}

