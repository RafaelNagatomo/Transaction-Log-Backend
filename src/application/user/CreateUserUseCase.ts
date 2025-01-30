import bcrypt from 'bcrypt'
import User from '~/domain/entities/User'
import IUserRepository from '~/domain/repositories/IUserRepository'

export default class CreateUserUseCase {
  constructor(private iUserRepository: IUserRepository) {}

  async execute(user: User): Promise<User> {
    if (!user.password) {
      throw new Error("Password is required")
    }

    const hashedPassword = await bcrypt.hash(user.password, 10)
    const newUser = { ...user, password: hashedPassword }

    return this.iUserRepository.createUser(newUser)
  }
}
