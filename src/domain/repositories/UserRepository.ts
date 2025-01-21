import User from "../entities/User"

interface UserRepository {
  createUser(user: User): Promise<User>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
}

export default UserRepository
