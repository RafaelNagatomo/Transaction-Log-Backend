import UserRepositoryMongo from '../../../infra/repositories/UserRepositoryMongo'
import UserModel from '../../../infra/database/models/UserModel'
import User from '../../../domain/entities/User'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

describe("UserRepositoryMongo", () => {
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

  describe("createUser", () => {
    it("should create a new user", async () => {
      const userData: User = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      const createdUser = await userRepository.createUser(userData)

      expect(createdUser).toHaveProperty('_id')
      expect(createdUser.name).toBe(userData.name)
      expect(createdUser.email).toBe(userData.email)
      expect(createdUser.password).not.toBe(userData.password)
      expect(bcrypt.compareSync(userData.password, createdUser.password)).toBe(true)
    })

    it("should throw an error if user creation fails", async () => {
      jest.spyOn(UserModel, 'create').mockRejectedValueOnce(new Error('Database error'))

      const userData: User = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      await expect(userRepository.createUser(userData)).rejects.toThrow('Failed to create user')
    })
  })

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

    it("should throw an error if finding user by email fails", async () => {
      jest.spyOn(UserModel, 'findOne').mockRejectedValueOnce(new Error('Database error'))

      await expect(userRepository.findByEmail("john@example.com")).rejects.toThrow('Failed to find user by email')
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

    it("should throw an error if finding user by ID fails", async () => {
      jest.spyOn(UserModel, 'findById').mockRejectedValueOnce(new Error('Database error'))

      await expect(userRepository.findById("507f1f77bcf86cd799439011")).rejects.toThrow('Failed to find user by ID')
    }, 10000)
  })
})
