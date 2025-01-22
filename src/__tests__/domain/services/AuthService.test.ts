import User from "../../../domain/entities/User"
import UserRepository from "../../../domain/repositories/UserRepository"
import AuthService from "../../../domain/services/AuthService"
import bcrypt from "bcrypt"
import JwtUtils from '../../../infra/utils/jwtUtils'

jest.mock("bcrypt")
jest.mock("../../../infra/utils/jwtUtils")

describe("AuthService", () => {
  let authService: AuthService
  let mockUserRepository: UserRepository
  let mockUser: User

  beforeEach(() => {
    mockUserRepository = {
      createUser: jest.fn(),
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
