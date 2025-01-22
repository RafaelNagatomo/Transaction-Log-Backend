import bcrypt from 'bcrypt'
import CreateUser from '../../../../application/use-cases/user/CreateUser'
import UserRepository from '../../../../domain/repositories/UserRepository'
import User from '../../../../domain/entities/User'

jest.mock('bcrypt')

describe("CreateUser", () => {
  let createUser: CreateUser
  let mockUserRepository: UserRepository
  let mockUser: User

  beforeEach(() => {
    mockUserRepository = {
      createUser: jest.fn(),
    } as unknown as UserRepository

    createUser = new CreateUser(mockUserRepository)

    mockUser = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("execute", () => {
    it("should hash the password and create a new user", async () => {
      const hashedPassword = "hashedpassword"
      const newUser = { ...mockUser, password: hashedPassword }

      ;(bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword)
      mockUserRepository.createUser = jest.fn().mockResolvedValue(newUser)

      const result = await createUser.execute(mockUser)

      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10)
      expect(mockUserRepository.createUser).toHaveBeenCalledWith(newUser)
      expect(result).toEqual(newUser)
    })

    it("should throw an error if bcrypt.hash fails", async () => {
      const mockError = new Error("Hashing failed")

      ;(bcrypt.hash as jest.Mock).mockRejectedValue(mockError)

      await expect(createUser.execute(mockUser)).rejects.toThrow("Hashing failed")
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10)
      expect(mockUserRepository.createUser).not.toHaveBeenCalled()
    })

    it("should throw an error if UserRepository.createUser fails", async () => {
      const hashedPassword = "hashedpassword"
      const newUser = { ...mockUser, password: hashedPassword }
      const mockError = new Error("User creation failed")

      ;(bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword)
      mockUserRepository.createUser = jest.fn().mockRejectedValue(mockError)

      await expect(createUser.execute(mockUser)).rejects.toThrow("User creation failed")
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10)
      expect(mockUserRepository.createUser).toHaveBeenCalledWith(newUser)
    })
  })
})
