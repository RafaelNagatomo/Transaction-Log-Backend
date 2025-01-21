import User from "../entities/User"

class UserRepository {
  async createUser(user: User): Promise<User> {
    throw new Error('createUser Not implemented')
  }
  async findByEmail(email: string): Promise<User | null> {
    throw new Error('Method not implemented');
  }

  async findById(id: string): Promise<User | null> {
    throw new Error('Method not implemented');
  }
}

export default UserRepository