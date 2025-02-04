import User from "../../domain/entities/User"
import IUserRepository from "../../domain/repositories/IUserRepository"
import UserModel from "../database/models/UserModel"

export default class UserRepositoryMongo implements IUserRepository {
  async createUser(user: User): Promise<User> {
    const createdUser = await UserModel.create(user)
    return createdUser.toObject()
  }

  async findAllUsers(): Promise<User[]> {
    const users = await UserModel.find()
    .sort({ name: 1 })
    .exec()

    return users.map(user => user.toObject())
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email }).exec()
    return user ? user.toObject() : null
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id).exec()
    return user ? user.toObject() : null
  }
}
