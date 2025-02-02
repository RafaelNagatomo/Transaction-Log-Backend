import { eventEmitter } from "./eventEmitter"
import LogActionUseCase from "~/application/activityLog/LogActionUseCase"
import ActivityLogRepositoryMongo from "../repositories/ActivityLogRepositoryMongo"
import ActivityLog from "~/domain/entities/ActivityLog"

const activityLogRepositoryMongo = new ActivityLogRepositoryMongo()
const logActionUseCase = new LogActionUseCase(activityLogRepositoryMongo)

const handleEvent = async (data: ActivityLog) => {
  await logActionUseCase.execute(data)
}

eventEmitter.on("transactionCreated", (data) => handleEvent(data))
eventEmitter.on("transactionUpdated", (data) => handleEvent(data))
eventEmitter.on("transactionDeleted", (data) => handleEvent(data))
