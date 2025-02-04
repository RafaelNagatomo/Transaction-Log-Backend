import User from "../../domain/entities/User"
import AuthService from "../../domain/services/AuthService"

export default class RegisterUserUseCase {
  private readonly authService: AuthService

  constructor(authService: AuthService) {
    this.authService = authService
  }
  
  async execute(
    name: string,
    email: string,
    password: string
  ): Promise<User> {
    return this.authService.register(name, email, password)
  }
}
