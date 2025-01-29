import Transaction from "~/domain/entities/Transaction"
import ITransactionRepository from "~/domain/repositories/ITransactionRepository"
import TransactionModel from "../database/models/TransactionModel"

export default class TransactionRepositoryMongo implements ITransactionRepository {
  async createTransaction(transaction: Transaction): Promise<Transaction> {
    try {
      const newTransaction = await TransactionModel.create(transaction)
      return newTransaction.toObject()
    } catch (error) {
      console.error('Error creating transaction:', error)
      throw new Error('Failed to create transaction')
    }
  }

  async findAllTransactions(): Promise<Transaction[]> {
    try {
      const transactions = await TransactionModel.find()
      .sort({ createdAt: -1 })
      .exec()

      return transactions.map(transaction => transaction.toObject())
    } catch (error) {
      console.error('Error to get all transactions:', error)
      throw new Error('Failed to get all transactions')
    }
  }

  async findTransactionById(id: string): Promise<Transaction | null> {
    try {
      const transaction = await TransactionModel.findById(id).exec()
      return transaction ? transaction.toObject() : null
    } catch (error) {
      console.error('Error to get transaction:', error)
      throw new Error('Failed to get transaction')
    }
  }

  async updateTransaction(transaction: Transaction): Promise<Transaction | null> {
    try {
      const updatedTransaction = await TransactionModel.findByIdAndUpdate(
        transaction._id,
        { ...transaction },
        { new: true }
      ).exec()
      return updatedTransaction ? updatedTransaction.toObject() : null
    } catch (error) {
      console.error('Error to update transaction:', error)
      throw new Error('Failed to update transaction')
    }
  }

  async deleteTransaction(id: string): Promise<Transaction | null> {
    try {
      const transaction = await TransactionModel.findByIdAndDelete(id).exec()
      return transaction
    } catch (error) {
      console.error('Error to delete transaction:', error)
      throw new Error('Failed to delete transaction')
    }
  }
}
