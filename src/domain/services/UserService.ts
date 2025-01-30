import { JwtPayload } from "jsonwebtoken"

class UserService {
  private user: JwtPayload | null = null
  
  setUser(user: JwtPayload) {
    this.user = user
  }

  getUser() {
    return this.user
  }

  clearUser() {
    this.user = null
  }
}

export const userService = new UserService()
