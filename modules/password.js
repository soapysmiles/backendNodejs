var bcrypt = require('bcrypt');


/**
 * @name encrypt encrypts a password
 * @author A.M
 * @param {string} password - password to encrypt (plain text)
 * @param {string} preSalt (optional) will generate if not given
 * @returns {object} hash, salt 
 */
exports.encrypt = (password, preSalt) => {
    const salt = preSalt || bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    return {hash: hash, salt: salt}   
}
    
/**
 * @name comparePassword compares plaintext password to encrypted password
 * @author A.M
 * @param {string} plainPass - plain text password to compare against
 * @param {string} salt - salt of the encrypted password
 * @param {string} hashword encrypted password
 * @returns {boolean} false if passwords not same
 * @returns {boolean} true if passwords same
 */
exports.comparePassword = (plainPass, salt, hashword) => {
    const passHash = bcrypt.hashSync(plainPass, salt)
    if(hashword === passHash) return true
    return false
}
