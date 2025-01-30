import AuthService from "~/domain/services/AuthService"

export default class LogoutUserUseCase {
  private readonly authService: AuthService
  
  constructor(authService: AuthService) {
    this.authService = authService
  }

  async execute(token: string): Promise<void> {
    return this.authService.logout(token)
  }
}
