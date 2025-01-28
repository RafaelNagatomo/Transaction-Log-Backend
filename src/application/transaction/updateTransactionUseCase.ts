import Transaction from "~/domain/entities/Transaction"
import TransactionRepositoryMongo from "~/infrastructure/repositories/TransactionRepositoryMongo"

export default class UpdateTransactionUseCase {
  constructor(private transactionRepositoryMongo: TransactionRepositoryMongo) {}
    
  async execute(transaction: Transaction): Promise<Transaction | null> {
    return this.transactionRepositoryMongo.updateTransaction(transaction)
  }
}
