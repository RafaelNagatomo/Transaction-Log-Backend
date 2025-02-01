import express from 'express'
import FindAllUsersUseCase from '~/application/user/FindAllUsersUseCase'
import UserRepositoryMongo from '~/infrastructure/repositories/UserRepositoryMongo'
import UserController from '../controllers/UserController'

const activityLogRouter = express.Router()

const userRepositoryMongo = new UserRepositoryMongo()
const findAllUsersUseCase = new FindAllUsersUseCase(userRepositoryMongo)

const userController = new UserController(findAllUsersUseCase)

activityLogRouter.get('/', userController.getAll.bind(userController))

export default activityLogRouter
