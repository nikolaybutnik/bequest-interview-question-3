import express from 'express'
import cors from 'cors'
import crypto from 'crypto'

const PORT = 8080
const app = express()
app.use(cors())
app.use(express.json())

let database = { data: 'Hello World', hash: '' }
// The history array will store previous verions of data, so that in the event that tampering
// is detected, we can roll back to a previous valid state
let history: { data: string; hash: string }[] = []

const generateHash = (data: string) =>
  crypto.createHash('sha256').update(data).digest('hex')

// Initialize the database with hash
database.hash = generateHash(database.data)
history.push({ data: database.data, hash: database.hash })

// Get current data and its hash
app.get('/', (req, res) => {
  res.json({ data: database.data, hash: database.hash })
})

// Update data and push previous state to history
app.post('/', (req, res) => {
  const newData = req.body.data
  const newHash = generateHash(newData)

  database.data = newData
  database.hash = newHash

  history.push({ data: newData, hash: newHash })

  res.json({ message: 'Data updated successfully' })
})

// Receive data from the client and verify integrity
app.post('/verify', (req, res) => {
  const clientData = req.body.data
  const clientHash = generateHash(clientData)

  if (clientHash === database.hash) {
    res.json({ valid: true, message: 'Data is valid' })
  } else {
    res.json({ valid: false, message: 'Data has been tampered with' })
  }
})

// Recover last valid state
app.post('/recover', (req, res) => {
  if (history.length > 0) {
    const lastState = history[history.length - 1]
    if (lastState) {
      database.data = lastState.data
      database.hash = lastState.hash
    }
    res.json({
      message: 'Data successfully recovered',
      data: database.data,
    })
  } else {
    res.status(404).json({ message: 'History is empty' })
  }
})

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT)
})
