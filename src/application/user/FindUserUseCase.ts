import User from "~/domain/entities/User"
import UserRepositoryMongo from "~/infrastructure/repositories/UserRepositoryMongo"

export default class FindTransactionByIdUseCase {
  constructor(private userRepositoryMongo: UserRepositoryMongo) {}
    
  async execute(id: string): Promise<User | null> {
    return this.userRepositoryMongo.findById(id)
  }
}
