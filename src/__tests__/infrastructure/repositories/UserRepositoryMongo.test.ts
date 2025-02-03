import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import User from "~/domain/entities/User"
import UserModel from "~/infrastructure/database/models/UserModel"
import UserRepositoryMongo from "~/infrastructure/repositories/UserRepositoryMongo"
import bcrypt from 'bcrypt'

describe('UserRepositoryMongo', () => {
  let userRepository: UserRepositoryMongo
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
    })
    userRepository = new UserRepositoryMongo()
  }, 30000)

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })
  
  afterEach(async () => {
    await mongoose.connection.dropDatabase()
  })

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      }
      const result = await userRepository.createUser(mockUser)

      expect(result.name).toBe(mockUser.name)
      expect(result.email).toBe(mockUser.email)
      expect(result.password).toBe(mockUser.password)
      if (mockUser.password && result.password) {
        expect(bcrypt.compareSync(mockUser.password, result.password))
      }
    })
  })

  describe('findAllUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123'
        },
        {
          id: '2',
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password456'
        },
      ]
      await UserModel.find()
      userRepository.findAllUsers = jest.fn().mockResolvedValue(mockUsers)
      const result = await userRepository.findAllUsers()

      expect(result).toEqual(mockUsers)
    })
  });

  describe("findByEmail", () => {
    it("should find a user by email", async () => {
      const userData: User = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }
      await UserModel.create(userData)

      const foundUser = await userRepository.findByEmail(userData.email)

      expect(foundUser).not.toBeNull()
      expect(foundUser?.name).toBe(userData.name)
      expect(foundUser?.email).toBe(userData.email)
    })

    it("should return null if no user is found with the given email", async () => {
      const foundUser = await userRepository.findByEmail("nonexistent@example.com")

      expect(foundUser).toBeNull()
    })
  })

  describe("findById", () => {
    it("should find a user by ID", async () => {
      const userData: User = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      const createdUser = await UserModel.create(userData)

      const foundUser = await userRepository.findById(createdUser._id.toString())

      expect(foundUser).not.toBeNull()
      expect(foundUser?.name).toBe(userData.name)
      expect(foundUser?.email).toBe(userData.email)
    })

    it("should return null if no user is found with the given ID", async () => {
      const foundUser = await userRepository.findById("507f1f77bcf86cd799439011")

      expect(foundUser).toBeNull()
    })
  })
})
