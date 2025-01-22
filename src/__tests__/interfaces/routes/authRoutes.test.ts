import request from 'supertest'
import express from 'express'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import UserRepositoryMongo from '../../../infra/repositories/UserRepositoryMongo'
import AuthService from '../../../domain/services/AuthService'
import RegisterUser from '../../../application/use-cases/auth/RegisterUser'
import LoginUser from '../../../application/use-cases/auth/LoginUser'
import LogoutUser from '../../../application/use-cases/auth/LogoutUser'
import AuthController from '../../../interfaces/controllers/AuthControllers'

// Configuração do banco de dados em memória
let mongoServer: MongoMemoryServer

beforeAll(async () => {
  // Inicia o servidor MongoDB em memória
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()

  // Conecta o Mongoose ao banco de dados em memória
  await mongoose.connect(uri)
})

afterAll(async () => {
  // Desconecta o Mongoose e para o servidor em memória
  await mongoose.disconnect()
  await mongoServer.stop()
})

afterEach(async () => {
  // Limpa todas as coleções após cada teste
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
})

describe("Auth Routes", () => {
  let app: express.Express
  let userRepository: UserRepositoryMongo
  let authService: AuthService
  let registerUser: RegisterUser
  let loginUser: LoginUser
  let logoutUser: LogoutUser
  let authController: AuthController

  beforeAll(() => {
    // Configuração do Express e das rotas
    app = express()
    app.use(express.json())

    // Instância das dependências
    userRepository = new UserRepositoryMongo()
    authService = new AuthService(userRepository)
    registerUser = new RegisterUser(authService)
    loginUser = new LoginUser(authService)
    logoutUser = new LogoutUser(authService)
    authController = new AuthController(registerUser, loginUser, logoutUser)

    // Adiciona as rotas de autenticação ao Express
    app.post('/register', authController.register.bind(authController))
    app.post('/login', authController.login.bind(authController))
  })

  // Testes para a rota POST /register
  describe("POST /register", () => {
    it("should register a new user and return 201 status", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      const response = await request(app)
        .post('/register')
        .send(userData)

      // Verifica se a resposta está correta
      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('_id')
      expect(response.body.name).toBe(userData.name)
      expect(response.body.email).toBe(userData.email)
    })

    it("should return 400 status if registration fails", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      // Mock de um erro no AuthService
      jest.spyOn(authService, 'register').mockRejectedValueOnce(new Error('Registration failed'))

      const response = await request(app)
        .post('/register')
        .send(userData)

      // Verifica se a resposta está correta
      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Registration failed' })
    })
  })

  // Testes para a rota POST /login
  describe("POST /login", () => {
    it("should login a user and return 200 status with a token", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      // Cria um usuário no banco de dados
      await userRepository.createUser(userData)

      const loginData = {
        email: "john@example.com",
        password: "password123",
      }

      const response = await request(app)
        .post('/login')
        .send(loginData)

      // Verifica se a resposta está correta
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
    })

    it("should return 400 status if login fails", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "wrongpassword",
      }

      const response = await request(app)
        .post('/login')
        .send(loginData)

      // Verifica se a resposta está correta
      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'User not found' })
    })
  })
})