var bcrypt = require('bcrypt');

module.exports = class password {
    constructor(){
        return this
    }

    encrypt(password, preSalt) {
        const salt = preSalt || bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        return {hash: hash, salt: salt}   
    }
    

    comparePassword(plainPass, salt, hashword) {
        const passHash = bcrypt.hashSync(plainPass, salt)
        if(hashword === passHash) return true
        return false
    }
}