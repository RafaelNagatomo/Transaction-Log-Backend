import Transaction from "~/domain/entities/Transaction"
import User from "~/domain/entities/User"
import UserRepositoryMongo from "~/infrastructure/repositories/UserRepositoryMongo"

export default class FindAllUsersUseCase {
  constructor(private userRepositoryMongo: UserRepositoryMongo) {}

  async execute(): Promise<User[]> {
    return this.userRepositoryMongo.findAllUsers()
  }
}
