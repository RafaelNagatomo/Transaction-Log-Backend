import express from 'express'
import ActivityLogController from '../controllers/ActivityLogController'
import ActivityLogRepositoryMongo from '../../infrastructure/repositories/ActivityLogRepositoryMongo'
import FindAllLogsUseCase from '../../application/activityLog/FindAllLogsUseCase'
import LogActionUseCase from '../../application/activityLog/LogActionUseCase'

const activityLogRouter = express.Router()

const activityLogRepositoryMongo = new ActivityLogRepositoryMongo()
const findAllLogsUseCase = new FindAllLogsUseCase(activityLogRepositoryMongo)
const logActionUseCase = new LogActionUseCase(activityLogRepositoryMongo)

const activityLogController = new ActivityLogController(
  findAllLogsUseCase,
  logActionUseCase
)

activityLogRouter.get('/', activityLogController.getAll.bind(activityLogController))

export default activityLogRouter
