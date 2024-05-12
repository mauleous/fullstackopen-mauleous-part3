const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'Name required']
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (newNumber) => {
        const numbers = newNumber.split('-')
        const numberOfDash = numbers.length - 1;

        if (numberOfDash !== 1) {
          // There should only be 1 '-' char
          return false
        }

        if (numbers[0].length < 2 || numbers[0].length > 3) {
          // first part needs to either 2 or 3 digits
          return false
        }

        if (isNan(numbers[0])) {
          // both sections of newNumber should be numbers
          return false
        }

        return true
      }
    },
    required: [true, 'Phone number required']
  }
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Phonebook', phonebookSchema)