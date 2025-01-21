import { Request, Response } from 'express'
import RegisterUser from '../../application/use-cases/auth/RegisterUser'
import LoginUser from '../../application/use-cases/auth/LoginUser'
import LogoutUser from '../../application/use-cases/auth/LogoutUser'

class AuthController {
  private registerUser: RegisterUser
  private loginUser: LoginUser
  private logoutUser: LogoutUser

  constructor(
    registerUser: RegisterUser,
    loginUser: LoginUser,
    logoutUser: LogoutUser
  ) {
    this.registerUser = registerUser
    this.loginUser = loginUser
    this.logoutUser = logoutUser
  }

  async register(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body
    try {
      const user = await this.registerUser.execute(name, email, password)
      res.status(201).json(user)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body
    try {
      const token = await this.loginUser.execute(email, password)
      res.status(200).json({ token })
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

    const token = authorizationHeader.split(' ')[1]
    try {
      await this.logoutUser.execute(token)
      res.status(200).json({ message: 'Logged out successfully' })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}

export default AuthController
