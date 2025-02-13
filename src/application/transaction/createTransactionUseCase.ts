import Transaction from "../../domain/entities/Transaction"
import TransactionRepositoryMongo from "../../infrastructure/repositories/TransactionRepositoryMongo"

export default class CreateTransactionUseCase {
  constructor(private transactionRepositoryMongo: TransactionRepositoryMongo) {}
    
  async execute(
    transaction: Transaction,
    clientIp: string, 
    userAgent: string
  ): Promise<Transaction | null> {
    const allTransactions = await this.transactionRepositoryMongo.findAllTransactions()
    const transactionAlreadyExists = allTransactions.find(t =>
      t.description === transaction.description
    )

    if (transactionAlreadyExists) {
      throw new Error('Transaction already exists')
    }

    return this.transactionRepositoryMongo.createTransaction(
      transaction,
      clientIp,
      userAgent
    )
  }
}
