import express from 'express'
import connectDB from './infra/config/database'
import dotenv from 'dotenv'

dotenv.config()
const PORT = process.env.PORT || 4000

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World')
})

connectDB()

app.listen(PORT, () => {
  console.log('Server is running on port 4000...')
})