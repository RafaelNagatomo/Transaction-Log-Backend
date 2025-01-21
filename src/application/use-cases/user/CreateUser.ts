import bcrypt from 'bcrypt'
import User from '../../../domain/entities/User'
import UserRepository from '../../../domain/repositories/UserRepository'

class CreateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(user: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10)
    const newUser = { ...user, password: hashedPassword }
    return this.userRepository.createUser(newUser)
  }
}

export default CreateUser
