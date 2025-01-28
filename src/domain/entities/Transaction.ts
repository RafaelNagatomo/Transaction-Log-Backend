export default class Transaction {
  readonly _id?: string
  readonly type: 'income' | 'outcome'
  readonly amount: number
  readonly description: string
  readonly status: string
  readonly isActive: boolean
  readonly createdAt?: Date
  readonly updatedAt?: Date

  constructor({ type, amount, description, status, isActive }: Transaction) {
    if (!amount || !description) {
      throw new Error('Missing required properties: amount, description')
    }
    
    this.type = type
    this.amount = amount
    this.description = description
    this.status = status
    this.isActive = isActive
  }

}
