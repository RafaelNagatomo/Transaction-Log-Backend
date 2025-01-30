import Transaction from "../entities/Transaction"

export default interface ITransactionRepository {
  createTransaction(
    transaction: Transaction,
    clientIp: string,
    userAgent: string
  ): Promise<Transaction| null>

  findAllTransactions(): Promise<Transaction[]>

  findTransactionById(
    id: string
  ): Promise<Transaction | null>

  updateTransaction(
    transaction: Transaction,
    clientIp: string,
    userAgent: string
  ): Promise<Transaction | null>

  deleteTransaction(
    id: string,
    clientIp: string,
    userAgent: string
  ): Promise<Transaction | null>
}
