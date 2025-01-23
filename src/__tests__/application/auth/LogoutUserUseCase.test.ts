import LogoutUserUseCase from "~/application/auth/LogoutUserUseCase"
import AuthService from "~/domain/services/AuthService"

describe("LogoutUser", () => {
  let logoutUserUseCase: LogoutUserUseCase
  let mockAuthService: AuthService

  beforeEach(() => {
    mockAuthService = {
      logout: jest.fn(),
    } as unknown as AuthService

    logoutUserUseCase = new LogoutUserUseCase(mockAuthService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("execute", () => {
    it("should call authService.logout with the correct token", async () => {
      const token = "fake-token"

      mockAuthService.logout = jest.fn().mockResolvedValue(undefined)

      await logoutUserUseCase.execute(token)

      expect(mockAuthService.logout).toHaveBeenCalledWith(token)
    })

    it("should throw an error if authService.logout throws an error", async () => {
      const token = "fake-token"
      const mockError = new Error("Logout failed")

      mockAuthService.logout = jest.fn().mockRejectedValue(mockError)

      await expect(logoutUserUseCase.execute(token)).rejects.toThrow("Logout failed")
      expect(mockAuthService.logout).toHaveBeenCalledWith(token)
    })
  })
})
