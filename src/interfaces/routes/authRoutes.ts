import { Router } from 'express'
import AuthService from '../../domain/services/AuthService'
import UserRepositoryMongo from '../../infra/repositories/UserRepositoryMongo'
import RegisterUser from '../../application/use-cases/auth/RegisterUser'
import LoginUser from '../../application/use-cases/auth/LoginUser'
import AuthController from '../controllers/AuthControllers'
import LogoutUser from '../../application/use-cases/auth/LogoutUser'

const authRoutes: Router = Router()

const userRepository = new UserRepositoryMongo()
const authService = new AuthService(userRepository)
const registerUser = new RegisterUser(authService)
const loginUser = new LoginUser(authService)
const logoutUser = new LogoutUser(authService)
const authController = new AuthController(registerUser, loginUser, logoutUser)

authRoutes.post('/register', authController.register.bind(authController))
authRoutes.post('/login', authController.login.bind(authController))

export default authRoutes
