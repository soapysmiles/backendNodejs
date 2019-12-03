
'use strict'

/**
 * Function to check a given string to ensure alphanumical or has symbols: ,."!?\'-
 *
 * @name checkWord
 * @param test The string to test
 * @throws If string does not match requirements
 * @returns true
 *
 */
exports.checkWord = (string, name) => {
    const regex = new RegExp('^[a-zA-Z0-9 ,."!?\'\-]*$')
    if(!this.checkStringExists(string) || !regex.test(string)) {
        throw new Error(`Must supply ${name}`)
    }
    
    return true
}

/**
 * Function to check an ID
 *
 * @name checkID
 * @param ID the ID to check
 * @param name the name to use in error messages
 * @throws if ID is undefined, null or not a number
 * @returns true if successful
 */
exports.checkID = (ID, name) => {
    if(ID === undefined || ID === null || isNaN(ID)) {
        throw new Error(`Must supply ${name}`)
    }
    return true
}

/**
 * Function to check if string exists
 *
 * @name checkStringExists
 * @param test the test to check
 * @param name the name to use in error messages
 * @throws if test is null, undefined or length is 0
 * @returns true if successful
 */
exports.checkStringExists = (test, name) => {
    if(test === null || test === undefined || test.length === 0) {
        if(name){
            throw new Error(`Must supply ${name}`)
        }else{
            return false
        }
    }
    return true
}

/**
 * Function to take a date and convert to mySQL format
 * @param {string} dateString date to convert in YYYY-MM-DD format
 */
exports.convertDate = (dateString)=>{
    var strArr = dateString.split('-');//Split array by '-'
    var result = new Date(strArr[0], strArr[1] - 1, strArr[2]); 
    return result;
}

