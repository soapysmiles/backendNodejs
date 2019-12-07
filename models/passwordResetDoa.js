var mysql = require('promise-mysql');
var info = require('../config');
var jwt = require("jwt-simple");
const Valid = require('../modules/validator')


/**
 * @name getQuestionsAnswers
 * @param {int} uID the user ID
 * @throws if no questions found
 */
exports.getQuestionsAnswers = async (uID) => {
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
        
        const qa = await this.getQuestionsAnswers(uID)
            .catch(async (e) => {
            if(e.message = 'No questions found'){
                await this.insertQuestions(uID, data)
            }
        })

        await this.updateQuestions(qa.ID, data)
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
            SET securityQuestion1 = ${data.question1},
            securityQuestion2 = ${data.question2},
            securityAnswer1 = ${data.answer1},
            securityAnswer2 = ${data.answer2}
            WHERE ID = "${qID}";`;
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

    let sql = `INSERT INTO passwordReminder 
    (securityQuestion1,securityQuestion2,securityAnswer1,securityAnswer2, userID)
    VALUES(${data.question1},${data.question2},${data.answer1},${data.answer2},${uID});`;
    await connection.query(sql);
    
    connection.end()
    return true
}
