import User from "~/domain/entities/User"
import IUserRepository from "~/domain/repositories/IUserRepository"
import UserModel from "../database/models/UserModel"

class UserRepositoryMongo implements IUserRepository {
  async createUser(user: User): Promise<User> {
    try {
      const createdUser = await UserModel.create(user)
      return createdUser.toObject()
    } catch (error) {
      console.error('Error creating user:', error)
      throw new Error('Failed to create user')
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ email }).exec()
      return user ? user.toObject() : null
    } catch (error) {
      console.error('Error finding user by email:', error)
      throw new Error('Failed to find user by email')
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await UserModel.findById(id).exec()
      return user ? user.toObject() : null
    } catch (error) {
      console.error('Error finding user by ID:', error)
      throw new Error('Failed to find user by ID')
    }
  }
}

export default UserRepositoryMongo
