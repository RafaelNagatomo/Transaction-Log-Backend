import ActivityLog from "~/domain/entities/ActivityLog"
import IActivityLogRepository from "~/domain/repositories/IActivityLogRepository"
import ActivityLogModel from "../database/models/ActivityLogModel"

export default class ActivityLogRepositoryMongo implements IActivityLogRepository {
  async findAllLogs(): Promise<ActivityLog[]> {
    try {
      const ActivityLogs = await ActivityLogModel.find()
      .sort({ changedAt: -1 })
      .exec()

      return ActivityLogs.map(log => log.toObject())
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
