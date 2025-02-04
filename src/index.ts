import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './infrastructure/database/config/database'
import authRoutes from './presentation/routes/authRoutes'
import transactionRoutes from './presentation/routes/transactionRoutes'
import activityLogRoutes from './presentation/routes/activityLogRoutes'
import "./infrastructure/events/transactionListener"
import { authenticateToken } from './presentation/middlewares/authenticateToken'
import userRoutes from './presentation/routes/userRoutes'

dotenv.config()
const PORT = process.env.PORT || 4000

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)

app.use(authenticateToken)

app.use('/api/transactions', transactionRoutes)
app.use('/api/activitylogs', activityLogRoutes)
app.use('/api/users', userRoutes)

connectDB()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`)
})
