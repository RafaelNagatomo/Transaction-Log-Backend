import { IActivityLogFilters } from "~/domain/entities/ActivityLogFilters"

export default function activityLogFilters(filters: IActivityLogFilters) {
  const query: any = {}

  if (filters?.changedBy) {
    query["changedBy._id"] = filters.changedBy
  }

  if (filters?.action) {
    const actionsFilter =
      filters.action.split(',')
      .map((action: string) => action.trim())
    
    if (actionsFilter.length > 0) {
      query.action = { $in: actionsFilter }
    }
  }

  if (filters?.userAgent) {
    query.userAgent = { $regex: filters.userAgent, $options: "i" }
  }

  if (filters?.startDate || filters?.endDate) {
    query.changedAt = {}
    if (filters.startDate) query.changedAt.$gte = new Date(filters.startDate)
    if (filters.endDate) query.changedAt.$lte = new Date(filters.endDate)
  }

  return query
}
