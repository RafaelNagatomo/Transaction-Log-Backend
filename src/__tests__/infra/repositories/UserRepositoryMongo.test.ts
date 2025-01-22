import UserRepositoryMongo from '../../../infra/repositories/UserRepositoryMongo'
import UserModel from '../../../infra/database/models/UserModel'
import User from '../../../domain/entities/User'

describe("UserRepositoryMongo", () => {
  let userRepository: UserRepositoryMongo

  beforeAll(async () => {
    // Instância do repositório
    userRepository = new UserRepositoryMongo()
  })

  afterEach(async () => {
    // Limpa a coleção de usuários após cada teste
    await UserModel.deleteMany({})
  })

  // Testes para createUser
  describe("createUser", () => {
    it("should create a new user", async () => {
      const userData: User = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      const createdUser = await userRepository.createUser(userData)

      // Verifica se o usuário foi criado corretamente
      expect(createdUser).toHaveProperty('_id')
      expect(createdUser.name).toBe(userData.name)
      expect(createdUser.email).toBe(userData.email)
      expect(createdUser.password).toBe(userData.password)
    })

    it("should throw an error if user creation fails", async () => {
      // Mock de um erro no Mongoose
      jest.spyOn(UserModel, 'create').mockRejectedValueOnce(new Error('Database error'))

      const userData: User = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      // Verifica se a função lança um erro
      await expect(userRepository.createUser(userData)).rejects.toThrow('Failed to create user')
    })
  })

  // Testes para findByEmail
  describe("findByEmail", () => {
    it("should find a user by email", async () => {
      const userData: User = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      // Cria um usuário no banco de dados
      await UserModel.create(userData)

      const foundUser = await userRepository.findByEmail(userData.email)

      // Verifica se o usuário foi encontrado corretamente
      expect(foundUser).not.toBeNull()
      expect(foundUser?.name).toBe(userData.name)
      expect(foundUser?.email).toBe(userData.email)
    })

    it("should return null if no user is found with the given email", async () => {
      const foundUser = await userRepository.findByEmail("nonexistent@example.com")

      // Verifica se o usuário não foi encontrado
      expect(foundUser).toBeNull()
    })

    it("should throw an error if finding user by email fails", async () => {
      // Mock de um erro no Mongoose
      jest.spyOn(UserModel, 'findOne').mockRejectedValueOnce(new Error('Database error'))

      // Verifica se a função lança um erro
      await expect(userRepository.findByEmail("john@example.com")).rejects.toThrow('Failed to find user by email')
    })
  })

  // Testes para findById
  describe("findById", () => {
    it("should find a user by ID", async () => {
      const userData: User = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      // Cria um usuário no banco de dados
      const createdUser = await UserModel.create(userData)

      const foundUser = await userRepository.findById(createdUser._id.toString())

      // Verifica se o usuário foi encontrado corretamente
      expect(foundUser).not.toBeNull()
      expect(foundUser?.name).toBe(userData.name)
      expect(foundUser?.email).toBe(userData.email)
    })

    it("should return null if no user is found with the given ID", async () => {
      const foundUser = await userRepository.findById("507f1f77bcf86cd799439011") // ID inválido

      // Verifica se o usuário não foi encontrado
      expect(foundUser).toBeNull()
    })

    it("should throw an error if finding user by ID fails", async () => {
      // Mock de um erro no Mongoose
      jest.spyOn(UserModel, 'findById').mockRejectedValueOnce(new Error('Database error'))

      // Verifica se a função lança um erro
      await expect(userRepository.findById("507f1f77bcf86cd799439011")).rejects.toThrow('Failed to find user by ID')
    })
  })
})
