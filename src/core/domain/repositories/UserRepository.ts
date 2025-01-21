import User from "../entities/User"

class UserRepository {
    async getUserById(id: string): Promise<User> {
        throw new Error('getUserById Not implemented')
    }
    async getUserByEmail(email: string): Promise<User> {
        throw new Error('getUserByEmail Not implemented')
    }
    async createUser(user: User): Promise<User> {
        throw new Error('createUser Not implemented')
    }
    async updateUser(user: User): Promise<User> {
        throw new Error('updateUser Not implemented')
    }
    async deleteUser(id: string): Promise<void> {
        throw new Error('deleteUser Not implemented')
    }
}

export default UserRepository