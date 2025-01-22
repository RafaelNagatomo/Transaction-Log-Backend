import { Request, Response } from 'express'
import AuthController from '../../../interfaces/controllers/AuthControllers'
import RegisterUser from '../../../application/use-cases/auth/RegisterUser'
import LoginUser from '../../../application/use-cases/auth/LoginUser'
import LogoutUser from '../../../application/use-cases/auth/LogoutUser'

describe("AuthController", () => {
  let authController: AuthController
  let mockRegisterUser: RegisterUser
  let mockLoginUser: LoginUser
  let mockLogoutUser: LogoutUser
  let req: Request
  let res: Response

  beforeEach(() => {
    // Cria mocks para as dependências
    mockRegisterUser = {
      execute: jest.fn(),
    } as unknown as RegisterUser

    mockLoginUser = {
      execute: jest.fn(),
    } as unknown as LoginUser

    mockLogoutUser = {
      execute: jest.fn(),
    } as unknown as LogoutUser

    // Instância do AuthController com os mocks
    authController = new AuthController(mockRegisterUser, mockLoginUser, mockLogoutUser)

    // Mock do objeto Request
    req = {
      body: {},
      headers: {},
    } as Request

    // Mock do objeto Response
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response
  })

  afterEach(() => {
    jest.clearAllMocks() // Limpa os mocks após cada teste
  })

  // Testes para o método register
  describe("register", () => {
    it("should register a user and return 201 status", async () => {
      const userData = { name: "John Doe", email: "john@example.com", password: "password123" }
      req.body = userData

      const mockUser = { id: "123", ...userData }
      mockRegisterUser.execute = jest.fn().mockResolvedValue(mockUser)

      await authController.register(req, res)

      // Verifica se o RegisterUser.execute foi chamado com os dados corretos
      expect(mockRegisterUser.execute).toHaveBeenCalledWith(userData.name, userData.email, userData.password)
      // Verifica se o status 201 foi retornado
      expect(res.status).toHaveBeenCalledWith(201)
      // Verifica se o usuário criado foi retornado no JSON
      expect(res.json).toHaveBeenCalledWith(mockUser)
    })

    it("should return 400 status if registration fails", async () => {
      const userData = { name: "John Doe", email: "john@example.com", password: "password123" }
      req.body = userData

      const mockError = new Error("Registration failed")
      mockRegisterUser.execute = jest.fn().mockRejectedValue(mockError)

      await authController.register(req, res)

      // Verifica se o status 400 foi retornado
      expect(res.status).toHaveBeenCalledWith(400)
      // Verifica se a mensagem de erro foi retornada no JSON
      expect(res.json).toHaveBeenCalledWith({ error: "Registration failed" })
    })
  })

  // Testes para o método login
  describe("login", () => {
    it("should login a user and return 200 status with a token", async () => {
      const loginData = { email: "john@example.com", password: "password123" }
      req.body = loginData

      const mockToken = "fake-token"
      mockLoginUser.execute = jest.fn().mockResolvedValue(mockToken)

      await authController.login(req, res)

      // Verifica se o LoginUser.execute foi chamado com os dados corretos
      expect(mockLoginUser.execute).toHaveBeenCalledWith(loginData.email, loginData.password)
      // Verifica se o status 200 foi retornado
      expect(res.status).toHaveBeenCalledWith(200)
      // Verifica se o token foi retornado no JSON
      expect(res.json).toHaveBeenCalledWith({ token: mockToken })
    })

    it("should return 400 status if login fails", async () => {
      const loginData = { email: "john@example.com", password: "password123" }
      req.body = loginData

      const mockError = new Error("Login failed")
      mockLoginUser.execute = jest.fn().mockRejectedValue(mockError)

      await authController.login(req, res)

      // Verifica se o status 400 foi retornado
      expect(res.status).toHaveBeenCalledWith(400)
      // Verifica se a mensagem de erro foi retornada no JSON
      expect(res.json).toHaveBeenCalledWith({ error: "Login failed" })
    })
  })

  // Testes para o método logout
  describe("logout", () => {
    it("should logout a user and return 200 status", async () => {
      const token = "fake-token"
      req.headers.authorization = `Bearer ${token}`

      await authController.logout(req, res)

      // Verifica se o LogoutUser.execute foi chamado com o token correto
      expect(mockLogoutUser.execute).toHaveBeenCalledWith(token)
      // Verifica se o status 200 foi retornado
      expect(res.status).toHaveBeenCalledWith(200)
      // Verifica se a mensagem de sucesso foi retornada no JSON
      expect(res.json).toHaveBeenCalledWith({ message: "Logged out successfully" })
    })

    it("should return 401 status if authorization header is missing", async () => {
      req.headers.authorization = undefined

      await authController.logout(req, res)

      // Verifica se o status 401 foi retornado
      expect(res.status).toHaveBeenCalledWith(401)
      // Verifica se a mensagem de erro foi retornada no JSON
      expect(res.json).toHaveBeenCalledWith({ error: "Authorization header missing" })
      // Verifica se o LogoutUser.execute NÃO foi chamado
      expect(mockLogoutUser.execute).not.toHaveBeenCalled()
    })

    it("should return 400 status if logout fails", async () => {
      const token = "fake-token"
      req.headers.authorization = `Bearer ${token}`

      const mockError = new Error("Logout failed")
      mockLogoutUser.execute = jest.fn().mockRejectedValue(mockError)

      await authController.logout(req, res)

      // Verifica se o status 400 foi retornado
      expect(res.status).toHaveBeenCalledWith(400)
      // Verifica se a mensagem de erro foi retornada no JSON
      expect(res.json).toHaveBeenCalledWith({ error: "Logout failed" })
    })
  })
})
