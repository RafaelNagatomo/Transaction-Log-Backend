import { JwtPayload } from "jsonwebtoken"
import { userService } from "~/domain/services/UserService"

describe("UserService", () => {
  const mockUser: JwtPayload = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    iat: 1234567890,
    exp: 1234567890
  }

  beforeEach(() => {
    userService.clearUser()
  })
  
  it("should return null if no user is set", async () => {
    const caughtUser = userService.getUser()
    expect(caughtUser).toBeNull()
  })

  it("should set and get the user correctly", async () => {
    userService.setUser(mockUser)

    const caughtUser = userService.getUser()
    expect(caughtUser).toEqual(mockUser)
  })

  it("should clear the user correctly", async () => {
    userService.setUser(mockUser)
    userService.clearUser()

    const caughtUser = userService.getUser()
    expect(caughtUser).toBeNull()
  })
})
