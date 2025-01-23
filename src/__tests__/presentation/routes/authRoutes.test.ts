import request from 'supertest'
import express from 'express'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import UserRepositoryMongo from '~/infrastructure/repositories/UserRepositoryMongo'
import AuthService from '~/domain/services/AuthService'
import RegisterUserUseCase from '~/application/auth/RegisterUserUseCase'
import LoginUserUseCase from '~/application/auth/LoginUserUseCase'
import LogoutUserUseCase from '~/application/auth/LogoutUserUseCase'
import AuthController from '~/presentation/controllers/AuthControllers'

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()

  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

afterEach(async () => {
    await mongoose.connection.dropDatabase()
  })

describe("Auth Routes", () => {
  let app: express.Express
  let userRepository: UserRepositoryMongo
  let authService: AuthService
  let registerUserUseCase: RegisterUserUseCase
  let loginUserUseCase: LoginUserUseCase
  let logoutUserUseCase: LogoutUserUseCase
  let authController: AuthController

  beforeAll(() => {
    app = express()
    app.use(express.json())

    userRepository = new UserRepositoryMongo()
    authService = new AuthService(userRepository)
    registerUserUseCase = new RegisterUserUseCase(authService)
    loginUserUseCase = new LoginUserUseCase(authService)
    logoutUserUseCase = new LogoutUserUseCase(authService)
    authController = new AuthController(registerUserUseCase, loginUserUseCase, logoutUserUseCase)

    app.post('/register', authController.register.bind(authController))
    app.post('/login', authController.login.bind(authController))
  })

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

      jest.spyOn(authService, 'register').mockRejectedValueOnce(new Error('Registration failed'))

      const response = await request(app)
        .post('/register')
        .send(userData)

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Registration failed' })
    })
  })

  describe("POST /login", () => {
    it("should login a user and return 200 status with a token", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      await userRepository.createUser(userData)

      const loginData = {
        email: "john@example.com",
        password: "password123",
      }

      const response = await request(app)
        .post('/login')
        .send(loginData)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
    }, 10000)

    it("should return 400 status if login fails", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "wrongpassword",
      }

      const response = await request(app)
        .post('/login')
        .send(loginData)

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'User not found' })
    })
  })
})
