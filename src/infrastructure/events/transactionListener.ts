import { eventEmitter } from "./eventEmitter"
import LogActionUseCase from "~/application/activityLog/LogActionUseCase"
import ActivityLogRepositoryMongo from "../repositories/ActivityLogRepositoryMongo"

const activityLogRepositoryMongo = new ActivityLogRepositoryMongo()
const logActionUseCase = new LogActionUseCase(activityLogRepositoryMongo)

const handleEvent = async (data: any) => {
  await logActionUseCase.execute(data)
}

eventEmitter.on("transactionCreated", (data) => handleEvent(data))
eventEmitter.on("transactionUpdated", (data) => handleEvent(data))
eventEmitter.on("transactionDeleted", (data) => handleEvent(data))
