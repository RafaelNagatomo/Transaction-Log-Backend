import ActivityLog from "~/domain/entities/ActivityLog"
import { IActivityLogFilters } from "~/domain/entities/ActivityLogFilters"
import ActivityLogRepositoryMongo from "~/infrastructure/repositories/ActivityLogRepositoryMongo"

export default class FindAllLogsUseCase {
  constructor (private activityLogRepositoryMongo: ActivityLogRepositoryMongo) {}

  async execute(filters?: IActivityLogFilters): Promise<ActivityLog[]> {
    return this.activityLogRepositoryMongo.findAllLogs(filters)
  }
}
