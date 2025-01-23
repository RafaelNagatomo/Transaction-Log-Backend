import express from 'express'
import dotenv from 'dotenv'
import connectDB from '~/infrastructure/config/database'
import authRoutes from '~/presentation/routes/authRoutes'

dotenv.config()
const PORT = process.env.PORT || 4000

const app = express()
app.use(express.json())

app.use('/auth', authRoutes)

connectDB()

app.listen(PORT, () => {
  console.log('Server is running on port 4000...')
})