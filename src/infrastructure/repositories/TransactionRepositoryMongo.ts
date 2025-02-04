import Transaction from "../../domain/entities/Transaction"
import ITransactionRepository from "../../domain/repositories/ITransactionRepository"
import TransactionModel from "../database/models/TransactionModel"
import { eventEmitter } from "../events/eventEmitter"
import { userService } from "../../domain/services/UserService"

export default class TransactionRepositoryMongo implements ITransactionRepository {
  async createTransaction(
    transaction: Transaction,
    clientIp: string, 
    userAgent: string
  ): Promise<Transaction | null> {
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
  }

  async findAllTransactions(): Promise<Transaction[]> {
    const transactions = await TransactionModel.find()
    .sort({ createdAt: -1 })
    .exec()

    return transactions.map(transaction => transaction.toObject())
  }

  async findTransactionById(id: string): Promise<Transaction | null> {
    const transaction = await TransactionModel
    .findById(id)
    .exec()
    
    return transaction ? transaction.toObject() : null
  }

  async updateTransaction(
    transaction: Transaction,
    clientIp: string, 
    userAgent: string
  ): Promise<Transaction | null> {
    const currentUser = userService.getUser()

    const oldTransaction = await TransactionModel.findById(transaction._id)

    const updatedTransaction = await TransactionModel.findByIdAndUpdate(
      transaction._id,
      { ...transaction },
      { new: true }
    ).exec()

    if (updatedTransaction) {
      eventEmitter.emit("transactionUpdated", {
        eventType: 'Transaction',
        action: 'Update',
        oldData: oldTransaction?.toObject() ?? null,
        newData: updatedTransaction.toObject(),
        changedBy: currentUser?.user,
        changedAt: Date.now(),
        clientIp: clientIp,
        userAgent: userAgent
      })
    }

    return updatedTransaction ? updatedTransaction.toObject() : null
  }

  async deleteTransaction(
    id: string,
    clientIp: string, 
    userAgent: string
  ): Promise<Transaction | null> {
    const currentUser = userService.getUser()

    const oldTransaction = await TransactionModel.findById(id)

    const deletedTransaction = await TransactionModel
    .findByIdAndDelete(id)
    .exec()

    if (deletedTransaction) {
      eventEmitter.emit("transactionDeleted", {
        eventType: 'Transaction',
        action: 'Delete',
        oldData: oldTransaction?.toObject() ?? null,
        newData: null,
        changedBy: currentUser?.user,
        changedAt: Date.now(),
        clientIp: clientIp,
        userAgent: userAgent
      })
    }

    return deletedTransaction
  }
}
