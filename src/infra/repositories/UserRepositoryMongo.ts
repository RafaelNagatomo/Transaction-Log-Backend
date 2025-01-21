import User from "../../domain/entities/User"
import UserRepository from "../../domain/repositories/UserRepository"
import UserModel from "../database/models/UserModel"

class UserRepositoryMongo extends UserRepository {
  async create(user: User): Promise<User> {
    const newUser = await UserModel.create(user)
    return newUser.toObject()
  }
}

export default UserRepositoryMongo