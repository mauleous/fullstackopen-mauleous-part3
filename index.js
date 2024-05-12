require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

// Morgan configuration
const morganConfig = (tokens, request, response) => {

  let morganConfigArray = [
    tokens.method(request, response),
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, 'content-length'), '-',
    tokens['response-time'](request, response), 'ms',
  ]

  if(tokens.method(request, response) === 'POST') {
    morganConfigArray = morganConfigArray.concat(JSON.stringify(request.body))
  }

  return morganConfigArray.join(' ')
}
app.use(morgan(morganConfig))

// Database
const Person = require('./models/person')

// Local data
let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

// Get info
app.get('/info', (request, response) => {

  // With local data
  /*const infoMessage = `<p>Phonebook has info for ${persons.length} people</p>`

  const now = new Date()
  const timeMessage = `<p>${now}</p>`

  response.send(infoMessage + timeMessage)*/

  // With database
  Person.find({})
    .then(persons => {
      const infoMessage = `<p>Phonebook has info for ${persons.length} people</p>`

      const now = new Date()
      const timeMessage = `<p>${now}</p>`

      response.send(infoMessage + timeMessage)
    })
})

// Get all persons
app.get('/api/persons', (request, response) => {
  // With local data
  //response.json(persons)

  // With database
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
})

// Get a person by ID
app.get('/api/persons/:id', (request, response, next) => {
  // With local data
  /*const personId = Number(request.params.id)
  const person = persons.find((person) => person.id === personId)

  if(person) {
    response.send(person)
  }
  else {
    response.status(404).end()
  } */ 

  // With database
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Delete a person by ID
app.delete('/api/persons/:id', (request, response, next) => {

  // With local data
  /*const personId = Number(request.params.id)
  persons = persons.filter(person => person.id !== personId)

  response.status(204).end()*/

  // With database
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Add a person
app.post('/api/persons', (request, response, next) => {
  const newPerson = request.body

  // Validations
  const isDataComplete = (newPerson.name && newPerson.number) ? true : false
  if(!isDataComplete) {
    return response.status(400).json({ 
      error: 'Data is not complete. Name and/or number is missing' 
    })
  }

  // Duplicate is not allowed - local data
  /*const isDuplicate = persons.some(person => person.name === newPerson.name)
  if(isDuplicate) {
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }*/

  // Add the new person - local data
  /*const newPersonId = Math.floor(Math.random() * 10000) + 1
  newPerson.id = newPersonId  
  persons = persons.concat(newPerson)
  
  response.json(newPerson)*/

  // Add the new person - with database
  const person = new Person({
    name: newPerson.name,
    number: newPerson.number
  })

  person.save()
    .then(result => {
      console.log('Person saved!')
      response.json(result)
    })
    .catch(error => next(error))


})

// Update a person
app.put('/api/persons/:id', (request, response, next) => {
  const toBeUpdatedPerson = request.body

  const person = {
    name: toBeUpdatedPerson.name,
    number: toBeUpdatedPerson.number,
  }

  Person.findByIdAndUpdate(
    request.params.id, 
    person, 
    {new: true, runValidators: true, context: 'query'}
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// Error handlers
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})