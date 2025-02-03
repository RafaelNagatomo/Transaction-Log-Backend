import bcrypt from "bcrypt"
import User from "~/domain/entities/User"
import IUserRepository from "~/domain/repositories/IUserRepository"
import AuthService from "~/domain/services/AuthService"
import JwtUtils from '~/infrastructure/utils/jwtUtils'

jest.mock("bcrypt")
jest.mock("~/infrastructure/utils/jwtUtils")

describe("AuthService", () => {
  let authService: AuthService
  let mockUserRepository: IUserRepository
  let mockUser: User

  beforeEach(() => {
    mockUserRepository = {
      createUser: jest.fn(),
      findAllUsers: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    }

    authService = new AuthService(mockUserRepository)

    mockUser = {
      id: "123",
      name: "John Doe",
      email: "john@example.com",
      password: "hashedpassword",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("register", () => {
    it("should register a new user and return the created user", async () => {
      mockUserRepository.createUser = jest.fn().mockResolvedValue(mockUser)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword")

      const result = await authService.register("John Doe", "john@example.com", "password123")

      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10)
      expect(mockUserRepository.createUser).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        password: "hashedpassword",
      })
      expect(result).toEqual(mockUser)
    })
  
    it('should throw an error if name is not provided', async () => {
      const result = await authService.register("", "john@example.com", "password123")
      await expect(result).rejects.toThrow('Name is required')
    })
  
    it('should throw an error if email is not provided', async () => {
      const result = await authService.register("John Doe", "", "password123")
      await expect(result).rejects.toThrow('Email is required')
    })
  
    it('should throw an error if password is not provided', async () => {
      const result = await authService.register("John Doe", "john@example.com", "")
      await expect(result).rejects.toThrow('Password is required')
    })
  })

  describe("login", () => {
    it("should login a user and return a token", async () => {
      mockUserRepository.findByEmail = jest.fn().mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      ;(JwtUtils.generateToken as jest.Mock).mockReturnValue("fake-token")

      const result = await authService.login("john@example.com", "password123")

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith("john@example.com")
      expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedpassword")
      expect(JwtUtils.generateToken).toHaveBeenCalledWith({ user: "123" })
      expect(result).toBe("fake-token")
    })

    it("should throw an error if user is not found", async () => {
      mockUserRepository.findByEmail = jest.fn().mockResolvedValue(null)

      await expect(authService.login("nonexistent@example.com", "password123")).rejects.toThrow(
        "User not found"
      )
    })

    it("should throw an error if password is invalid", async () => {
      mockUserRepository.findByEmail = jest.fn().mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      await expect(authService.login("john@example.com", "wrongpassword")).rejects.toThrow(
        "Invalid password"
      )
    })

    it('should throw an error if user.password is undefined', async () => {
      const userWithoutPassword = { email: 'test@example.com', password: undefined }
      mockUserRepository.findByEmail = jest.fn().mockResolvedValue(userWithoutPassword)
      
      await expect(authService.login('test@example.com', 'password123')).rejects.toThrow(
        'User password is undefined'
      )
    })
  })

  describe("logout", () => {
    it("should add the token to the blacklist", async () => {
      const token = "fake-token"

      await authService.logout(token)

      expect(authService.tokenBlacklist).toContain(token)
    })
  })

  describe("isTokenBlacklisted", () => {
    it("should return true if the token is blacklisted", async () => {
      const token = "fake-token"
      authService.tokenBlacklist.push(token)

      const result = await authService.isTokenBlacklisted(token)

      expect(result).toBe(true)
    })

    it("should return false if the token is not blacklisted", async () => {
      const token = "fake-token"

      const result = await authService.isTokenBlacklisted(token)

      expect(result).toBe(false)
    })
  })
})
