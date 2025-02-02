import ActivityLog from "~/domain/entities/ActivityLog"
import IActivityLogRepository from "~/domain/repositories/IActivityLogRepository"
import ActivityLogModel from "../database/models/ActivityLogModel"
import activityLogFilters from "../filters/activityLogFilters"
import { IActivityLogFilters } from "~/domain/entities/ActivityLogFilters"

export default class ActivityLogRepositoryMongo implements IActivityLogRepository {
  async findAllLogs(filters: IActivityLogFilters = {}): Promise<ActivityLog[]> {
    const query = activityLogFilters(filters)

    const ActivityLogs = await ActivityLogModel.find(query)
      .lean()
      .sort({ changedAt: -1 })
      .exec()
      .then((logs) => logs.map((log) => new ActivityLog(log)))

    return ActivityLogs
  }

  async logAction(logData: ActivityLog): Promise<ActivityLog> {
    const newActivityLog = await ActivityLogModel.create(logData)
    
    return newActivityLog
  }
}
