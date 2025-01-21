class User {
  id?: string
  name: string
  email: string
  password: string
  createdAt?: Date
  updatedAt?: Date

  constructor({ name, email, password }: User) {
    this.name = name
    this.email = email
    this.password = password
  }

}

export default User