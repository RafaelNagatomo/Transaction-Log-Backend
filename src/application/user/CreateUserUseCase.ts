import bcrypt from 'bcrypt'
import User from '~/domain/entities/User'
import IUserRepository from '~/domain/repositories/IUserRepository'

class CreateUserUseCase {
  constructor(private iUserRepository: IUserRepository) {}

  async execute(user: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10)
    const newUser = { ...user, password: hashedPassword }
    return this.iUserRepository.createUser(newUser)
  }
}

export default CreateUserUseCase
