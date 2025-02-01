import ActivityLog from "~/domain/entities/ActivityLog"
import IActivityLogRepository from "~/domain/repositories/IActivityLogRepository"
import ActivityLogModel from "../database/models/ActivityLogModel"
import activityLogFilters from "../filters/activityLogFilters"
import { IActivityLogFilters } from "~/domain/entities/ActivityLogFilters"

export default class ActivityLogRepositoryMongo implements IActivityLogRepository {
  async findAllLogs(filters: IActivityLogFilters = {}): Promise<ActivityLog[]> {
    try {
      const query = activityLogFilters(filters)

      const ActivityLogs = await ActivityLogModel.find(query)
        .lean()
        .sort({ changedAt: -1 })
        .exec()
        .then((logs) => logs.map((log) => new ActivityLog(log)))

      return ActivityLogs
    } catch (error) {
      console.error('Error to get all logs:', error)
      throw new Error('Failed to get all logs')
    }
  }

  async logAction(logData: ActivityLog): Promise<ActivityLog> {
    try {
      const newActivityLog = await ActivityLogModel.create(logData)
      
      return newActivityLog
    } catch (error) {
      console.error('Error to create log:', error)
      throw new Error('Failed to create log')
    }
  }
}
