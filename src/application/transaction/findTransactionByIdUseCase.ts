import Transaction from "../../domain/entities/Transaction"
import TransactionRepositoryMongo from "../../infrastructure/repositories/TransactionRepositoryMongo"

export default class FindTransactionByIdUseCase {
  constructor(private transactionRepositoryMongo: TransactionRepositoryMongo) {}
    
  async execute(id: string): Promise<Transaction | null> {
    return this.transactionRepositoryMongo.findTransactionById(id)
  }
}
