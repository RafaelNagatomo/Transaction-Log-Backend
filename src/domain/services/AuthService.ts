import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserRepository from '../../domain/repositories/UserRepository'
import User from '../entities/User'


class AuthService {
  private readonly userRepository: UserRepository
  constructor() {
      this.userRepository = new UserRepository()
    }

  async register(name: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await this.userRepository.createUser({ name, email, password: hashedPassword })
    return user
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) throw new Error('User not found')

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) throw new Error('Invalid password')

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' })
    return token
  }

  async logout(token: string): Promise<void> {
    // Implementar lógica de logout, como adicionar o token a uma blacklist
  }
}

export default AuthService
