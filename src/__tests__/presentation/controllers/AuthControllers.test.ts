import { Request, Response } from 'express'
import AuthController from '~/presentation/controllers/AuthControllers'
import RegisterUserUseCase from '~/application/auth/RegisterUserUseCase'
import LoginUserUseCase from '~/application/auth/LoginUserUseCase'
import LogoutUserUseCase from '~/application/auth/LogoutUserUseCase'

describe("AuthController", () => {
  let authController: AuthController
  let mockRegisterUserUseCase: RegisterUserUseCase
  let mockLoginUserUseCase: LoginUserUseCase
  let mockLogoutUserUseCase: LogoutUserUseCase
  let req: Request
  let res: Response

  beforeEach(() => {
    mockRegisterUserUseCase = {
      execute: jest.fn(),
    } as unknown as RegisterUserUseCase

    mockLoginUserUseCase = {
      execute: jest.fn(),
    } as unknown as LoginUserUseCase

    mockLogoutUserUseCase = {
      execute: jest.fn(),
    } as unknown as LogoutUserUseCase

    authController = new AuthController(
      mockRegisterUserUseCase,
      mockLoginUserUseCase,
      mockLogoutUserUseCase
    )

    req = {
      body: {},
      headers: {},
    } as Request

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("register", () => {
    it("should register a user and return 201 status", async () => {
      const userData = { name: "John Doe", email: "john@example.com", password: "password123" }
      req.body = userData

      const mockUser = { id: "123", ...userData }
      mockRegisterUserUseCase.execute = jest.fn().mockResolvedValue(mockUser)

      await authController.register(req, res)

      expect(mockRegisterUserUseCase.execute).toHaveBeenCalledWith(userData.name, userData.email, userData.password)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(mockUser)
    })

    it("should return 400 status if registration fails", async () => {
      const userData = { name: "John Doe", email: "john@example.com", password: "password123" }
      req.body = userData

      const mockError = new Error("Registration failed")
      mockRegisterUserUseCase.execute = jest.fn().mockRejectedValue(mockError)

      await authController.register(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: "Registration failed" })
    })
  })

  describe("login", () => {
    it("should login a user and return 200 status with a token", async () => {
      const loginData = { email: "john@example.com", password: "password123" }
      req.body = loginData

      const mockToken = "fake-token"
      mockLoginUserUseCase.execute = jest.fn().mockResolvedValue(mockToken)

      await authController.login(req, res)

      expect(mockLoginUserUseCase.execute).toHaveBeenCalledWith(loginData.email, loginData.password)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ token: mockToken })
    })

    it("should return 400 status if login fails", async () => {
      const loginData = { email: "john@example.com", password: "password123" }
      req.body = loginData

      const mockError = new Error("Login failed")
      mockLoginUserUseCase.execute = jest.fn().mockRejectedValue(mockError)

      await authController.login(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: "Login failed" })
    })
  })

  describe("logout", () => {
    it("should logout a user and return 200 status", async () => {
      const token = "fake-token"
      req.headers.authorization = `Bearer ${token}`

      await authController.logout(req, res)

      expect(mockLogoutUserUseCase.execute).toHaveBeenCalledWith(token)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ message: "Logged out successfully" })
    })

    it("should return 401 status if authorization header is missing", async () => {
      req.headers.authorization = undefined

      await authController.logout(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ error: "Authorization header missing" })
      expect(mockLogoutUserUseCase.execute).not.toHaveBeenCalled()
    })

    it("should return 400 status if logout fails", async () => {
      const token = "fake-token"
      req.headers.authorization = `Bearer ${token}`

      const mockError = new Error("Logout failed")
      mockLogoutUserUseCase.execute = jest.fn().mockRejectedValue(mockError)

      await authController.logout(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: "Logout failed" })
    })
  })
})
