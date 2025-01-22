import LoginUser from "../../../../application/use-cases/auth/LoginUser"
import AuthService from "../../../../domain/services/AuthService"

describe("LoginUser", () => {
  let loginUser: LoginUser
  let mockAuthService: AuthService

  beforeEach(() => {
    mockAuthService = {
      login: jest.fn(),
    } as unknown as AuthService

    loginUser = new LoginUser(mockAuthService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("execute", () => {
    it("should call authService.login with the correct email and password", async () => {
      const email = "john@example.com"
      const password = "password123"
      const mockToken = "fake-token"

      mockAuthService.login = jest.fn().mockResolvedValue(mockToken)

      const result = await loginUser.execute(email, password)

      expect(mockAuthService.login).toHaveBeenCalledWith(email, password)
      expect(result).toBe(mockToken)
    })

    it("should throw an error if authService.login throws an error", async () => {
      const email = "john@example.com"
      const password = "wrongpassword"
      const mockError = new Error("Invalid credentials")

      mockAuthService.login = jest.fn().mockRejectedValue(mockError)

      await expect(loginUser.execute(email, password)).rejects.toThrow("Invalid credentials")
      expect(mockAuthService.login).toHaveBeenCalledWith(email, password)
    })
  })
})
