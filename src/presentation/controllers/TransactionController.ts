import { Request, Response } from 'express'
import CreateTransactionUseCase from '~/application/transaction/CreateTransactionUseCase'
import FindAllTransactionsUseCase from '~/application/transaction/FindAllTransactionsUseCase'
import FindTransactionByIdUseCase from '~/application/transaction/FindTransactionByIdUseCase'
import UpdateTransactionUseCase from '~/application/transaction/UpdateTransactionUseCase'
import DeleteTransactionUseCase from '~/application/transaction/DeleteTransactionUseCase'
import { getClientInfo } from '~/infrastructure/utils/getClientInfo'

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
    const {
      createdBy,
      type,
      amount,
      description,
      status = 'pending',
      isActive = true
    } = req.body

    const { clientIp, userAgent } = getClientInfo(req)

    try {
      const createTransaction = await this.createTransactionUseCase.execute({
        createdBy,
        type,
        amount,
        description,
        status,
        isActive
      },
        clientIp,
        userAgent
      )
      res.status(201).json(createTransaction)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const getAllTransactions = await this.findAllTransactionsUseCase.execute()

      res.status(200).json(getAllTransactions)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.body

    try {
      const getTransaction = await this.findTransactionByIdUseCase.execute(id)

      res.status(200).json(getTransaction)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const {
      _id,
      createdBy,
      type,
      amount,
      description,
      status,
      isActive
    } = req.body

    const { clientIp, userAgent } = getClientInfo(req)
    
    try {
      const updateTransaction = await this.updateTransactionUseCase.execute({
        _id,
        createdBy,
        type,
        amount,
        description,
        status,
        isActive
      },
        clientIp,
        userAgent
      )

      res.status(200).json(updateTransaction)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { _id } = req.body
    const { clientIp, userAgent } = getClientInfo(req)

    try {
      const getTransaction = await this.deleteTransactionUseCase.execute(
        _id,
        clientIp,
        userAgent
      )
      
      res.status(200).json(getTransaction)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
