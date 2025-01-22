import RegisterUser from "../../../../application/use-cases/auth/RegisterUser"
import User from "../../../../domain/entities/User"
import AuthService from "../../../../domain/services/AuthService"

describe("RegisterUser", () => {
  let registerUser: RegisterUser
  let mockAuthService: AuthService
  let mockUser: User

  beforeEach(() => {
    mockAuthService = {
      register: jest.fn(),
    } as unknown as AuthService

    registerUser = new RegisterUser(mockAuthService)

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

  describe("execute", () => {
    it("should call authService.register with the correct name, email and password", async () => {
      const name = "Jhon"
      const email = "john@example.com"
      const password = "password123"

      mockAuthService.register = jest.fn().mockResolvedValue(mockUser)

      const result = await registerUser.execute(name, email, password)

      expect(mockAuthService.register).toHaveBeenCalledWith(name, email, password)
      expect(result).toEqual(mockUser)
    })

    it("should throw an error if authService.register throws an error", async () => {
      const name = "Jhon"
      const email = "john@example.com"
      const password = "wrongpassword"
      const mockError = new Error("Registration failed")

      mockAuthService.register = jest.fn().mockRejectedValue(mockError)

      await expect(registerUser.execute(name, email, password)).rejects.toThrow("Registration failed")
      expect(mockAuthService.register).toHaveBeenCalledWith(name, email, password)
    })
  })
})
