import bcrypt from 'bcrypt'
import UserRepository from '../../domain/repositories/UserRepository'
import User from '../entities/User'
import JwtUtils from '../../infra/utils/jwtUtils'

class AuthService {
  private readonly userRepository: UserRepository
  public tokenBlacklist: string[]

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
    this.tokenBlacklist = []
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await this.userRepository.createUser({
      name,
      email,
      password: hashedPassword
    })
    return user
  }

  async login(
    email: string,
    password: string
  ): Promise<string> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) throw new Error('User not found')

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) throw new Error('Invalid password')

    const token = JwtUtils.generateToken({ user: user.id })
    return token
  }

  async logout(token: string): Promise<void> {
    this.tokenBlacklist.push(token)
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return this.tokenBlacklist.includes(token)
  }
}

export default AuthService
