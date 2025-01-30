import Transaction from "~/domain/entities/Transaction"
import TransactionRepositoryMongo from "~/infrastructure/repositories/TransactionRepositoryMongo"

export default class DeleteTransactionUseCase {
  constructor(private transactionRepositoryMongo: TransactionRepositoryMongo) {}
    
  async execute(
    id: string,
    clientIp: string, 
    userAgent: string
  ): Promise<Transaction | null> {
    return this.transactionRepositoryMongo.deleteTransaction(
      id,
      clientIp,
      userAgent
    )
  }
}
