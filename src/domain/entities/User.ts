export default class User {
  readonly id?: string
  readonly name: string
  readonly email: string
  readonly password: string
  readonly createdAt?: Date
  readonly updatedAt?: Date

  constructor({ name, email, password }: User) {
    if (!name || !email || !password) {
      throw new Error('Missing required properties: name, email, password')
    }
    
    this.name = name
    this.email = email
    this.password = password
  }

}
