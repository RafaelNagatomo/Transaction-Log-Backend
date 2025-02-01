import User from "../entities/User"

export default interface IUserRepository {
  createUser(user: User): Promise<User>
  findAllUsers(): Promise<User[]>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
}
