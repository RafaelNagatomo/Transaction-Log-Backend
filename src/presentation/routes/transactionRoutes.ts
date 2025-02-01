import express from 'express'
import TransactionController from '../controllers/TransactionController'
import TransactionRepositoryMongo from '~/infrastructure/repositories/TransactionRepositoryMongo'
import CreateTransactionUseCase from '~/application/transaction/CreateTransactionUseCase'
import FindAllTransactionsUseCase from '~/application/transaction/FindAllTransactionsUseCase'
import FindTransactionByIdUseCase from '~/application/transaction/FindTransactionByIdUseCase'
import UpdateTransactionUseCase from '~/application/transaction/UpdateTransactionUseCase'
import DeleteTransactionUseCase from '~/application/transaction/DeleteTransactionUseCase'

const transactionRouter = express.Router()

const transactionRepositoryMongo = new TransactionRepositoryMongo()
const createTransactionUseCase = new CreateTransactionUseCase(transactionRepositoryMongo)
const findAllTransactionsUseCase = new FindAllTransactionsUseCase(transactionRepositoryMongo)
const findTransactionByIdUseCase = new FindTransactionByIdUseCase(transactionRepositoryMongo)
const updateTransactionUseCase = new UpdateTransactionUseCase(transactionRepositoryMongo)
const deleteTransactionUseCase = new DeleteTransactionUseCase(transactionRepositoryMongo)

const transactionController = new TransactionController(
  createTransactionUseCase,
  findAllTransactionsUseCase,
  findTransactionByIdUseCase,
  updateTransactionUseCase,
  deleteTransactionUseCase
)

transactionRouter.get('/', transactionController.getAll.bind(transactionController))
transactionRouter.post('/create', transactionController.create.bind(transactionController))
transactionRouter.get('/find/:id', transactionController.getById.bind(transactionController))
transactionRouter.put('/update/:id', transactionController.update.bind(transactionController))
transactionRouter.put('/delete/:id', transactionController.delete.bind(transactionController))

export default transactionRouter
