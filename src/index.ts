import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from '~/infrastructure/database/config/database'
import authRoutes from '~/presentation/routes/authRoutes'
import transactionRoutes from './presentation/routes/transactionRoutes'
import activityLogRoutes from './presentation/routes/activityLogRoutes'
import "./infrastructure/events/transactionListener"
import { authenticateToken } from './presentation/middlewares/authenticateToken'

dotenv.config()
const PORT = process.env.PORT || 4000

const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)

app.use(authenticateToken)

app.use('/transactions', transactionRoutes)
app.use('/activitylogs', activityLogRoutes)

connectDB()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)
})
