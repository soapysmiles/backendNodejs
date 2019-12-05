const Pass = require('../modules/password')

describe('encryptPassword', () =>{
    test('encrypt pass - should return same hash', () =>{
        expect.assertions(1)
        var pass = new Pass()
        const passHash = pass.encrypt('password')
        const passHash2 = pass.encrypt('password', passHash.salt)
        expect(passHash.hash).toEqual(passHash2.hash)

    })

    test('encrypt pass - should return different hash', () =>{
        expect.assertions(1)
        var pass = new Pass()
        const passHash = pass.encrypt('password')
        const passHash2 = pass.encrypt('password1', passHash.salt)
        expect(passHash.hash).not.toEqual(passHash2.hash)

    })
})

describe('compare password', () =>{
    test('Same password', () =>{
        expect.assertions(1)
        var pass = new Pass()
        const passHash = pass.encrypt('password')
        const result = pass.comparePassword('password', passHash.salt, passHash.hash)
        expect(result).toBe(true)

    })

    test('Not same password', () =>{
        expect.assertions(1)
        var pass = new Pass()
        const passHash = pass.encrypt('password')
        const result = pass.comparePassword('notsame', passHash.salt, passHash.hash)
        expect(result).toBe(false)

    })
})