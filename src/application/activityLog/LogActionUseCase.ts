import ActivityLog from "../../domain/entities/ActivityLog"
import ActivityLogRepositoryMongo from "../../infrastructure/repositories/ActivityLogRepositoryMongo"

export default class LogActionUseCase {
  constructor(private activityLogRepositoryMongo: ActivityLogRepositoryMongo) {}

  async execute(logData: ActivityLog): Promise<ActivityLog> {
    return this.activityLogRepositoryMongo.logAction(logData)
  }
}
