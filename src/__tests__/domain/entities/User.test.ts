import User from "../../domain/entities/User"

describe('User Class', () => {
  it('should create a User instance with the correct properties', () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    }

    const user = new User(userData)

    expect(user.name).toBe(userData.name)
    expect(user.email).toBe(userData.email)
    expect(user.password).toBe(userData.password)

    expect(user.id).toBeUndefined()
    expect(user.createdAt).toBeUndefined()
    expect(user.updatedAt).toBeUndefined()
  })
})
