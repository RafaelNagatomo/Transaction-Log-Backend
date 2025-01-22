import LogoutUser from "../../../../application/use-cases/auth/LogoutUser"
import AuthService from "../../../../domain/services/AuthService"

describe("LogoutUser", () => {
  let logoutUser: LogoutUser
  let mockAuthService: AuthService

  beforeEach(() => {
    mockAuthService = {
      logout: jest.fn(),
    } as unknown as AuthService

    logoutUser = new LogoutUser(mockAuthService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("execute", () => {
    it("should call authService.logout with the correct token", async () => {
      const token = "fake-token"

      mockAuthService.logout = jest.fn().mockResolvedValue(undefined)

      await logoutUser.execute(token)

      expect(mockAuthService.logout).toHaveBeenCalledWith(token)
    })

    it("should throw an error if authService.logout throws an error", async () => {
      const token = "fake-token"
      const mockError = new Error("Logout failed")

      mockAuthService.logout = jest.fn().mockRejectedValue(mockError)

      await expect(logoutUser.execute(token)).rejects.toThrow("Logout failed")
      expect(mockAuthService.logout).toHaveBeenCalledWith(token)
    })
  })
})
