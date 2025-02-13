import { Request, Response } from 'express'
import RegisterUserUseCase from '../../application/auth/RegisterUserUseCase'
import LoginUserUseCase from '../../application/auth/LoginUserUseCase'
import LogoutUserUseCase from '../../application/auth/LogoutUserUseCase'

export default class AuthController {
  private registerUserUseCase: RegisterUserUseCase
  private loginUserUseCase: LoginUserUseCase
  private logoutUserUseCase: LogoutUserUseCase

  constructor(
    registerUserUseCase: RegisterUserUseCase,
    loginUserUseCase: LoginUserUseCase,
    logoutUserUseCase: LogoutUserUseCase
  ) {
    this.registerUserUseCase = registerUserUseCase
    this.loginUserUseCase = loginUserUseCase
    this.logoutUserUseCase = logoutUserUseCase
  }

  async register(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body
    try {
      const user = await this.registerUserUseCase.execute(name, email, password)
      res.status(201).json(user)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body
    try {
      const data = await this.loginUserUseCase.execute(email, password)
      res.status(200).json(data)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) {
      res.status(401).json({ error: 'Authorization header missing' })
      return
    }

    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    try {
      if (!token) {
        throw new Error('Token not provided');
      }
      await this.logoutUserUseCase.execute(token)
      
      res.status(200).json({ message: 'Logged out successfully' })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
