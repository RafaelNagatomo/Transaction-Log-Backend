import { Router } from 'express'
import AuthService from '../../domain/services/AuthService'
import UserRepositoryMongo from '../../infrastructure/repositories/UserRepositoryMongo'
import RegisterUserUseCase from '../../application/auth/RegisterUserUseCase'
import LoginUserUseCase from '../../application/auth/LoginUserUseCase'
import AuthController from '../controllers/AuthController'
import LogoutUserUseCase from '../../application/auth/LogoutUserUseCase'

const authRouter: Router = Router()

const userRepositoryMongo = new UserRepositoryMongo()
const authService = new AuthService(userRepositoryMongo)
const registerUserUseCase = new RegisterUserUseCase(authService)
const loginUserUseCase = new LoginUserUseCase(authService)
const logoutUserUseCase = new LogoutUserUseCase(authService)
const authController = new AuthController(registerUserUseCase, loginUserUseCase, logoutUserUseCase)

authRouter.post('/register', authController.register.bind(authController))
authRouter.post('/login', authController.login.bind(authController))
authRouter.post('/logout', authController.logout.bind(authController))

export default authRouter
