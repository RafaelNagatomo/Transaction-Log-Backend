import bcrypt from 'bcrypt'
import User from '../entities/User'
import UserRepositoryMongo from '~/infrastructure/repositories/UserRepositoryMongo'
import JwtUtils from '~/infrastructure/utils/jwtUtils'
import { userService } from './UserService'

export default class AuthService {
  private readonly userRepositoryMongo: UserRepositoryMongo
  public tokenBlacklist: string[]

  constructor(userRepositoryMongo: UserRepositoryMongo) {
    this.userRepositoryMongo = userRepositoryMongo
    this.tokenBlacklist = []
  }

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<User> {
    try{
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await this.userRepositoryMongo.createUser({
        name,
        email,
        password: hashedPassword
      })
      return user
    } catch (error) {
      console.error('Error during registration:', error)
      throw new Error('Registration failed')
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    const user = await this.userRepositoryMongo.findByEmail(email)
    if (!user) throw new Error('User not found')

    if (!user.password) throw new Error('User password is undefined')
      
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) throw new Error('Invalid password')

    const { password: _, ...userWithoutPassword } = user

    const token = JwtUtils.generateToken({ user: user })
    return { user: userWithoutPassword, token }
  }

  async logout(token: string): Promise<void> {
    userService.clearUser()
    this.tokenBlacklist.push(token)
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return this.tokenBlacklist.includes(token)
  }
}
