var bcrypt = require('bcrypt');

exports.encrypt = (password, preSalt) => {
    const salt = preSalt || bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    return {hash: hash, salt: salt}   
}
    

exports.comparePassword = (plainPass, salt, hashword) => {
    const passHash = bcrypt.hashSync(plainPass, salt)
    if(hashword === passHash) return true
    return false
}
