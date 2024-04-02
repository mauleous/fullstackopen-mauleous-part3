const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Password is missing. Please give password as argument.')
  process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const url = `mongodb+srv://mauleous:${password}@cluster0.ubj2zcd.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

if(newName && newNumber){
  console.log('newName', newName)
  console.log('newNumber', newNumber)

  const phonebook = new Phonebook({
    name: newName,
    number: newNumber,
  })

  phonebook.save().then(result => {
    console.log('New phonebook entry saved!')
    mongoose.connection.close()
  })
}
else {
  console.log('phonebook:')
  Phonebook.find({}).then(result => {
    result.forEach(phonebook => {
      console.log(`${phonebook.name} ${phonebook.number}`)
    });
    mongoose.connection.close()
  })
}
