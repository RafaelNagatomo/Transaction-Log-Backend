import User from "~/domain/entities/User"
import IUserRepository from "~/domain/repositories/IUserRepository"

describe("UserRepository (Domain Interface)", () => {
  let userRepository: IUserRepository
  let mockUser: User

  beforeEach(() => {
    userRepository = {
      createUser: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    }

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

  describe("createUser", () => {
    it("should create a user and return the created user", async () => {
      userRepository.createUser = jest.fn().mockResolvedValue(mockUser)

      const result = await userRepository.createUser(mockUser)

      expect(userRepository.createUser).toHaveBeenCalledWith(mockUser)
      expect(result).toEqual(mockUser)
    })
  })

  describe("findByEmail", () => {
    it("should find a user by email and return the user", async () => {
      userRepository.findByEmail = jest.fn().mockResolvedValue(mockUser)

      const result = await userRepository.findByEmail("john@example.com")

      expect(userRepository.findByEmail).toHaveBeenCalledWith("john@example.com")
      expect(result).toEqual(mockUser)
    })

    it("should return null if no user is found with the given email", async () => {
      userRepository.findByEmail = jest.fn().mockResolvedValue(null)

      const result = await userRepository.findByEmail("nonexistent@example.com")

      expect(userRepository.findByEmail).toHaveBeenCalledWith("nonexistent@example.com")
      expect(result).toBeNull()
    })
  })

  describe("findById", () => {
    it("should find a user by id and return the user", async () => {
      userRepository.findById = jest.fn().mockResolvedValue(mockUser)

      const result = await userRepository.findById("123")

      expect(userRepository.findById).toHaveBeenCalledWith("123")
      expect(result).toEqual(mockUser)
    })

    it("should return null if no user is found with the given id", async () => {
      userRepository.findById = jest.fn().mockResolvedValue(null)

      const result = await userRepository.findById("nonexistent-id")

      expect(userRepository.findById).toHaveBeenCalledWith("nonexistent-id")
      expect(result).toBeNull()
    })
  })
})
