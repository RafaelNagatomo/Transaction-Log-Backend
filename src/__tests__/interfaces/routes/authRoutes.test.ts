import request from 'supertest'
import express from 'express'
import UserRepositoryMongo from '../../../infra/repositories/UserRepositoryMongo'
import AuthService from '../../../domain/services/AuthService'
import authRoutes from '../../../interfaces/routes/authRoutes'

// Mock do UserRepositoryMongo
jest.mock('../../../infra/repositories/UserRepositoryMongo')

describe("Auth Routes", () => {
  let app: express.Express

  beforeAll(() => {
    // Cria uma instância do Express e adiciona as rotas de autenticação
    app = express()
    app.use(express.json())
    app.use(authRoutes)
  })

  afterEach(() => {
    jest.clearAllMocks() // Limpa os mocks após cada teste
  })

  // Testes para a rota POST /register
  describe("POST /register", () => {
    it("should register a new user and return 201 status", async () => {
      const userData = { name: "John Doe", email: "john@example.com", password: "password123" }

      // Mock do UserRepositoryMongo e AuthService
      const mockUser = { id: "123", ...userData }
      const mockUserRepository = new UserRepositoryMongo() as jest.Mocked<UserRepositoryMongo>
      const mockAuthService = new AuthService(mockUserRepository)
      mockAuthService.register = jest.fn().mockResolvedValue(mockUser)

      const response = await request(app)
        .post('/register')
        .send(userData)

      // Verifica se a resposta está correta
      expect(response.status).toBe(201)
      expect(response.body).toEqual(mockUser)
      // Verifica se o AuthService.register foi chamado com os dados corretos
      expect(mockAuthService.register).toHaveBeenCalledWith(userData.name, userData.email, userData.password)
    })

    it("should return 400 status if registration fails", async () => {
      const userData = { name: "John Doe", email: "john@example.com", password: "password123" }

      // Mock do UserRepositoryMongo e AuthService para simular um erro
      const mockUserRepository = new UserRepositoryMongo() as jest.Mocked<UserRepositoryMongo>
      const mockAuthService = new AuthService(mockUserRepository)
      mockAuthService.register = jest.fn().mockRejectedValue(new Error("Registration failed"))

      const response = await request(app)
        .post('/register')
        .send(userData)

      // Verifica se a resposta está correta
      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: "Registration failed" })
    })
  })

  // Testes para a rota POST /login
  describe("POST /login", () => {
    it("should login a user and return 200 status with a token", async () => {
      const loginData = { email: "john@example.com", password: "password123" }

      // Mock do UserRepositoryMongo e AuthService
      const mockToken = "fake-token"
      const mockUserRepository = new UserRepositoryMongo() as jest.Mocked<UserRepositoryMongo>
      const mockAuthService = new AuthService(mockUserRepository)
      mockAuthService.login = jest.fn().mockResolvedValue(mockToken)

      const response = await request(app)
        .post('/login')
        .send(loginData)

      // Verifica se a resposta está correta
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ token: mockToken })
      // Verifica se o AuthService.login foi chamado com os dados corretos
      expect(mockAuthService.login).toHaveBeenCalledWith(loginData.email, loginData.password)
    })

    it("should return 400 status if login fails", async () => {
      const loginData = { email: "john@example.com", password: "password123" }

      // Mock do UserRepositoryMongo e AuthService para simular um erro
      const mockUserRepository = new UserRepositoryMongo() as jest.Mocked<UserRepositoryMongo>
      const mockAuthService = new AuthService(mockUserRepository)
      mockAuthService.login = jest.fn().mockRejectedValue(new Error("Login failed"))

      const response = await request(app)
        .post('/login')
        .send(loginData)

      // Verifica se a resposta está correta
      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: "Login failed" })
    })
  })
})
