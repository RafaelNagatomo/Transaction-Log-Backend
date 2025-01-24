import AuthService from "~/domain/services/AuthService"

export default class LoginUserUseCase {
  private readonly authService: AuthService
  constructor(authService: AuthService) {
    this.authService = authService
  }

  async execute(email: string, password: string): Promise<string> {
    return this.authService.login(email, password)
  }
}
