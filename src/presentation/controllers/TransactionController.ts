import { Request, Response } from 'express'
import CreateTransactionUseCase from '~/application/transaction/createTransactionUseCase'
import FindAllTransactionsUseCase from '~/application/transaction/findAllTransactionsUseCase'
import FindTransactionByIdUseCase from '~/application/transaction/findTransactionByIdUseCase'
import UpdateTransactionUseCase from '~/application/transaction/updateTransactionUseCase'
import DeleteTransactionUseCase from '~/application/transaction/deleteTransactionUseCase'

export default class TransactionController {
  private createTransactionUseCase: CreateTransactionUseCase
  private findAllTransactionsUseCase: FindAllTransactionsUseCase
  private findTransactionByIdUseCase: FindTransactionByIdUseCase
  private updateTransactionUseCase: UpdateTransactionUseCase
  private deleteTransactionUseCase: DeleteTransactionUseCase

  constructor(
    createTransactionUseCase: CreateTransactionUseCase,
    findAllTransactionsUseCase: FindAllTransactionsUseCase,
    findTransactionByIdUseCase: FindTransactionByIdUseCase,
    updateTransactionUseCase: UpdateTransactionUseCase,
    deleteTransactionUseCase: DeleteTransactionUseCase
  ) {
    this.createTransactionUseCase = createTransactionUseCase
    this.findAllTransactionsUseCase = findAllTransactionsUseCase
    this.findTransactionByIdUseCase = findTransactionByIdUseCase
    this.updateTransactionUseCase = updateTransactionUseCase
    this.deleteTransactionUseCase = deleteTransactionUseCase
  }

  async create(req: Request, res: Response): Promise<void> {
    const { user, type, amount, description, status = 'pending', isActive = true } = req.body
    const createTransaction = await this.createTransactionUseCase.execute({
      user,
      type,
      amount,
      description,
      status,
      isActive
    })
    res.status(201).json(createTransaction)
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const getAllTransactions = await this.findAllTransactionsUseCase.execute()
    res.status(200).json(getAllTransactions)
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.body
    const getTransaction = await this.findTransactionByIdUseCase.execute(id)
    res.status(200).json(getTransaction)
  }

  async update(req: Request, res: Response): Promise<void> {
    const { _id, user, type, amount, description, status, isActive } = req.body
    const updateTransaction = await this.updateTransactionUseCase.execute({
      _id,
      user,
      type,
      amount,
      description,
      status,
      isActive
    })
    res.status(200).json(updateTransaction)
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { _id } = req.body
    const getTransaction = await this.deleteTransactionUseCase.execute(_id)
    res.status(200).json(getTransaction)
  }
}
