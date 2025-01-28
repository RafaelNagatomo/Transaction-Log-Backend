import Transaction from "../entities/Transaction"

export default interface ITransactionRepository {
  createTransaction(transaction: Transaction): Promise<Transaction>
  findAllTransactions(): Promise<Transaction[]>
  findTransactionById(id: string): Promise<Transaction | null>
  updateTransaction(transaction: Transaction): Promise<Transaction | null>
  deleteTransaction(id: string): Promise<Transaction | null>
}
