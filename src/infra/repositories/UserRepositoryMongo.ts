import User from "../../domain/entities/User"
import UserRepository from "../../domain/repositories/UserRepository"
import UserModel from "../database/models/UserModel"

class UserRepositoryMongo extends UserRepository {
  async create(user: User): Promise<User> {
    const newUser = await UserModel.create(user)
    return newUser.toObject()
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email })
    return user ? user.toObject() : null
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id)
    return user ? user.toObject() : null
  }
}

export default UserRepositoryMongo
