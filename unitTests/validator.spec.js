
'use strict'

const valid = require('../modules/validator.js')

describe('checkWord()', () => {
	test('Error if empty', () => {
		expect.assertions(1)
        try{
            valid.checkWord('', 'name')
        }catch(err){
            expect(err).toEqual(Error('Must supply name'))
        }
	})

	test('Single word', () => {
		expect.assertions(1)
		
		const result = valid.checkWord('Red')
		expect(result).toBe(true)
	})

	test('Single word with numbers', () => {
		expect.assertions(1)
		
		const result = valid.checkWord('Red2')
		expect(result).toBe(true)
	})

	test('Multiple words', () => {
		expect.assertions(1)
		
		const result = valid.checkWord('Red Green Yellow Blue')
		expect(result).toBe(true)
	})

	test('Multiple words with numbers', () => {
		expect.assertions(1)
		
		const result = valid.checkWord('Red Green Yellow Blue 763')
		expect(result).toBe(true)
	})

	test('Symbols', () => {
		expect.assertions(1)
		
		const result = valid.checkWord(',.\'-')
		expect(result).toBe(true)
	})
})

describe('checkStringExists', () => {
    test('Valid string', () => {
        expect.assertions(1)

        
        const result = valid.checkStringExists('this string exists', 'name')
        expect(result).toBe(true)
    })
    test('Invalid string, valid name', () => {
        expect.assertions(1)

        
        try{
            valid.checkStringExists('', 'name')
        }catch(err){
           expect(err).toEqual(Error('Must supply name')) 
        } 
    })

    test('Invalid string, no name', () => {
        expect.assertions(1)

        
        
        const result = valid.checkStringExists('')
        
        expect(result).toBe(false) 
        
    })
})

describe('checkID()', () => {
	test('ID valid', () => {
		expect.assertions(1)
		
		const result = valid.checkID(1, 'gameID')
		expect(result).toBe(true)
	})

	test('Error if ID is null', () => {
		expect.assertions(1)
		
		const name = 'gameID'
		try{
			valid.checkID(null, name)
		}catch(e) {
			expect(e).toEqual(Error(`Must supply ${name}`))
		}
	})

	test('Error if ID is NaN', () => {
		expect.assertions(1)
		
		const name = 'gameID'
		try{
			valid.checkID('not a number', name)
		}catch(e) {
			expect(e).toEqual(Error(`Must supply ${name}`))
		}
	})

	test('Error if ID is undefined', () => {
		expect.assertions(1)
		
		const name = 'gameID'
		try{
			valid.checkID(undefined, name)
		}catch(e) {
			expect(e).toEqual(Error(`Must supply ${name}`))
		}
	})
})

