import express from 'express'
import dotenv from 'dotenv'
import connectDB from '~/infrastructure/config/database'
import authRoutes from '~/presentation/routes/authRoutes'
import cors from 'cors'

dotenv.config()
const PORT = process.env.PORT || 4000

const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)

connectDB()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)
})