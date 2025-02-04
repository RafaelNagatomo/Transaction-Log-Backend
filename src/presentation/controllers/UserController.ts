import { Request, Response } from 'express'
import FindAllUsersUseCase from '../../application/user/FindAllUsersUseCase'

export default class UserController {
    private findAllUsersUseCase: FindAllUsersUseCase

  constructor (
    findAllUsersUseCase: FindAllUsersUseCase
  ) {
    this.findAllUsersUseCase = findAllUsersUseCase
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try { 
      const getAllUsers = await this.findAllUsersUseCase.execute()
      res.status(200).json(getAllUsers)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
