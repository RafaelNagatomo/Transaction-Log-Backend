import Transaction from "../../domain/entities/Transaction"
import TransactionRepositoryMongo from "../../infrastructure/repositories/TransactionRepositoryMongo"

export default class FindAllTransactionsUseCase {
  constructor(private transactionRepositoryMongo: TransactionRepositoryMongo) {}

  async execute(): Promise<Transaction[]> {
    return this.transactionRepositoryMongo.findAllTransactions()
  }
}
  