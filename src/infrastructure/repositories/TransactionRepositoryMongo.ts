import Transaction from "~/domain/entities/Transaction"
import ITransactionRepository from "~/domain/repositories/ITransactionRepository"
import TransactionModel from "../database/models/TransactionModel"
import { eventEmitter } from "../events/eventEmitter"
import { userService } from "~/domain/services/UserService"

export default class TransactionRepositoryMongo implements ITransactionRepository {
  async createTransaction(
    transaction: Transaction,
    clientIp: string, 
    userAgent: string
  ): Promise<Transaction | null> {
    try {
      const currentUser = userService.getUser()
      
      const newTransaction = await TransactionModel.create(transaction)
      
      if (newTransaction) {
        eventEmitter.emit("transactionCreated", {
          eventType: 'Transaction',
          action: 'Create',
          oldData: null,
          newData: newTransaction.toObject(),
          changedBy: currentUser?.user,
          changedAt: Date.now(),
          clientIp: clientIp,
          userAgent: userAgent
        })
      }

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
      const transaction = await TransactionModel
      .findById(id)
      .exec()
      
      return transaction ? transaction.toObject() : null
    } catch (error) {
      console.error('Error to get transaction:', error)
      throw new Error('Failed to get transaction')
    }
  }

  async updateTransaction(
    transaction: Transaction,
    clientIp: string, 
    userAgent: string
  ): Promise<Transaction | null> {
    try {
      const currentUser = userService.getUser()

      const oldTransaction = await TransactionModel.findById(transaction._id)
      if (!oldTransaction) {
        throw new Error('Failed to get old transaction')
      }

      const updatedTransaction = await TransactionModel.findByIdAndUpdate(
        transaction._id,
        { ...transaction },
        { new: true }
      ).exec()

      if (updatedTransaction) {
        eventEmitter.emit("transactionUpdated", {
          eventType: 'Transaction',
          action: 'Update',
          oldData: oldTransaction.toObject(),
          newData: updatedTransaction.toObject(),
          changedBy: currentUser?.user,
          changedAt: Date.now(),
          clientIp: clientIp,
          userAgent: userAgent
        })
      }

      return updatedTransaction ? updatedTransaction.toObject() : null
    } catch (error) {
      console.error('Error to update transaction:', error)
      throw new Error('Failed to update transaction')
    }
  }

  async deleteTransaction(
    id: string,
    clientIp: string, 
    userAgent: string
  ): Promise<Transaction | null> {
    try {
      const currentUser = userService.getUser()

      const oldTransaction = await TransactionModel.findById(id)
      if (!oldTransaction) {
        throw new Error('Failed to get old transaction')
      }

      const deletedTransaction = await TransactionModel
      .findByIdAndDelete(id)
      .exec()

      if (deletedTransaction) {
        eventEmitter.emit("transactionDeleted", {
          eventType: 'Transaction',
          action: 'Delete',
          oldData: oldTransaction.toObject(),
          newData: null,
          changedBy: currentUser?.user,
          changedAt: Date.now(),
          clientIp: clientIp,
          userAgent: userAgent
        })
      }

      return deletedTransaction
    } catch (error) {
      console.error('Error to delete transaction:', error)
      throw new Error('Failed to delete transaction')
    }
  }
}
