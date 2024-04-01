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

// Data
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
  const infoMessage = `<p>Phonebook has info for ${persons.length} people</p>`

  const now = new Date()
  const timeMessage = `<p>${now}</p>`

  response.send(infoMessage + timeMessage)
})

// Get all persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// Get a person by ID
app.get('/api/persons/:id', (request, response) => {
  const personId = Number(request.params.id)
  const person = persons.find((person) => person.id === personId)

  if(person) {
    response.send(person)
  }
  else {
    response.status(404).end()
  }  
})

// Delete a person by ID
app.delete('/api/persons/:id', (request, response) => {
  const personId = Number(request.params.id)
  persons = persons.filter(person => person.id !== personId)

  response.status(204).end()
})

// Add a person
app.post('/api/persons', (request, response) => {
  const newPerson = request.body

  // Validations
  const isDataComplete = (newPerson.name && newPerson.number) ? true : false
  if(!isDataComplete) {
    return response.status(400).json({ 
      error: 'Data is not complete. Name and/or number is missing' 
    })
  }

  const isDuplicate = persons.some(person => person.name === newPerson.name)
  if(isDuplicate) {
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }

  // Add the new person
  const newPersonId = Math.floor(Math.random() * 10000) + 1
  newPerson.id = newPersonId  
  persons = persons.concat(newPerson)

  response.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})