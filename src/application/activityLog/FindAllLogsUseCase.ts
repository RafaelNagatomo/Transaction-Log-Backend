import ActivityLog from "~/domain/entities/ActivityLog"
import ActivityLogRepositoryMongo from "~/infrastructure/repositories/ActivityLogRepositoryMongo"

export default class FindAllLogsUseCase {
  constructor (private activityLogRepositoryMongo: ActivityLogRepositoryMongo) {}

  async execute(): Promise<ActivityLog[]> {
    return this.activityLogRepositoryMongo.findAllLogs()
  }
}
