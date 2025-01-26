import { Router } from 'express'
import AuthService from '~/domain/services/AuthService'
import UserRepositoryMongo from '~/infrastructure/repositories/UserRepositoryMongo'
import RegisterUserUseCase from '~/application/auth/RegisterUserUseCase'
import LoginUserUseCase from '~/application/auth/LoginUserUseCase'
import AuthController from '../controllers/AuthControllers'
import LogoutUserUseCase from '~/application/auth/LogoutUserUseCase'

const authRoutes: Router = Router()

const userRepositoryMongo = new UserRepositoryMongo()
const authService = new AuthService(userRepositoryMongo)
const registerUserUseCase = new RegisterUserUseCase(authService)
const loginUserUseCase = new LoginUserUseCase(authService)
const logoutUserUseCase = new LogoutUserUseCase(authService)
const authController = new AuthController(registerUserUseCase, loginUserUseCase, logoutUserUseCase)

authRoutes.post('/register', authController.register.bind(authController))
authRoutes.post('/login', authController.login.bind(authController))
authRoutes.post('/logout', authController.logout.bind(authController))

export default authRoutes
